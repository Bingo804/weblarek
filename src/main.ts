import "./scss/styles.scss";
import { Products } from "./components/modeles/products";
import { ShoppingCart } from "./components/modeles/shoppingcart";
import { Buyer } from "./components/modeles/buyer";
import { CommunicationLayer } from "./components/modeles/CommunicationLayer";
import { Api } from "./components/base/Api";
import { EventEmitter } from "./components/base/Events";
import { API_URL, CDN_URL } from "./utils/constants";
import { apiProducts } from "./utils/data";
import { Header } from "./components/views/Header";
import { Gallery } from "./components/views/Gallery";
import { CardCatalog } from "./components/views/CardCatalog";
import { CardPreview } from "./components/views/CardPreview";
import { CardBasket } from "./components/views/CardBasket";
import { Modal } from "./components/views/Modal";
import { CartView } from "./components/views/CardView";
import { OrderForm } from "./components/views/OrderForm";
import { ContactsForm } from "./components/views/ContactsForm";
import { SuccessView } from "./components/views/SuccessView";
import { cloneTemplate, ensureElement } from "./utils/utils";
import { TPayment } from "../src/types/index";

const events = new EventEmitter();

//МОДЕЛИ
const productsModel = new Products(events);
const cart = new ShoppingCart(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const communication = new CommunicationLayer(api);

//ПРЕДСТАВЛЕНИЯ
const headerContainer = ensureElement<HTMLElement>(".header__container");
const header = new Header(events, headerContainer);

const modalContainer = ensureElement<HTMLElement>("#modal-container");
const modal = new Modal(modalContainer);

const galleryContainer = ensureElement<HTMLElement>(".gallery");
const gallery = new Gallery(galleryContainer);

const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderTemplate = ensureElement<HTMLTemplateElement>("#order");
const contactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const successTemplate = ensureElement<HTMLTemplateElement>("#success");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

//ЭКЗЕМПЛЯРЫ ПРЕДСТАВЛЕНИЙ
const cartView = new CartView(cloneTemplate(basketTemplate), events);
const orderForm = new OrderForm(cloneTemplate(orderTemplate), events);
const contactsForm = new ContactsForm(cloneTemplate(contactsTemplate), events);
const successView = new SuccessView(cloneTemplate(successTemplate), () => modal.close());
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), events);

//ПОДПИСКА НА СОБЫТИЯ МОДЕЛЕЙ

events.on("catalog:changed", () => {
  renderCatalog();
});

events.on("catalog:card-changed", () => {
  const product = productsModel.getCard();
  if (!product) return;

  const inCart = cart.hasProduct(product.id);
  const hasPrice = product.price !== null && product.price > 0;

  cardPreview.render({
    image: `${CDN_URL}/${product.image}`,
    title: product.title,
    price: product.price,
    category: product.category,
    description: product.description || "",
    buttonText: !hasPrice ? "Недоступно" : inCart ? "Удалить из корзины" : "В корзину",
    buttonDisabled: !hasPrice,
  });

  modal.render({ content: cardPreview.render() });
});

events.on("basket:changed", () => {
  header.counter = cart.quantityProduct();
  renderBasketItems();
});

events.on("basket:remove", (data: { productId: string }) => {
  cart.deleteProduct(data.productId);
});

events.on("buyer:changed", () => {
  const data = buyer.getData();
  const errors = buyer.validate();

  orderForm.render({
    address: data.address,
    payment: data.payment,
    valid: !errors.address && !errors.payment,
    errors: errors.address || errors.payment || "",
  });

  contactsForm.render({
    email: data.email,
    phone: data.phone,
    valid: !errors.email && !errors.phone,
    errors: errors.email || errors.phone || "",
  });
});

//СОБЫТИЯ ОТ ПРЕДСТАВЛЕНИЙ

events.on("basket:open", () => {
  modal.render({ content: cartView.render() });
});

events.on("order:open", () => {
  modal.render({ content: orderForm.render() });
});

events.on("order:submit", () => {
  modal.render({ content: contactsForm.render() });
});

events.on("contacts:submit", async () => {
  await handleOrderSubmit();
});

events.on("order:payment-select", (data: { payment: TPayment }) => {
  buyer.setPayment(data.payment);
});

events.on("order:address-input", (data: { address: string }) => {
  buyer.setAddress(data.address);
});

events.on("contacts:email-input", (data: { email: string }) => {
  buyer.setEmail(data.email);
});

events.on("contacts:phone-input", (data: { phone: string }) => {
  buyer.setPhone(data.phone);
});

events.on("card:action", () => {
  const product = productsModel.getCard();
  if (!product) return;

  const hasPrice = product.price !== null && product.price > 0;
  if (!hasPrice) return;

  if (cart.hasProduct(product.id)) {
    cart.deleteProduct(product.id);
  } else {
    cart.addToCart(product);
  }
  modal.close();
});

//ФУНКЦИИ ПРЕЗЕНТЕРА

function renderCatalog(): void {
  const products = productsModel.getItems();
  const cardElements: HTMLElement[] = [];

  products.forEach((product) => {
    const clone = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(clone, () => {
      productsModel.setCard(product.id);
    });

    card.render({
      image: `${CDN_URL}/${product.image}`,
      title: product.title,
      price: product.price,
      category: product.category,
    });

    cardElements.push(clone);
  });

  gallery.catalog = cardElements;
}

function renderBasketItems(): void {
  const items = cart.getCart();
  const itemElements: HTMLElement[] = [];

  items.forEach((item, index) => {
    const itemClone = cloneTemplate(cardBasketTemplate);
    const cardBasket = new CardBasket(itemClone, events);

    cardBasket.render({
      title: item.title,
      price: item.price,
      index: index + 1,
      productId: item.id,
    });

    itemElements.push(itemClone);
  });

  cartView.render({
    items: itemElements,
    total: cart.priceCart(),
    buttonDisabled: cart.quantityProduct() === 0,
  });
}

async function handleOrderSubmit(): Promise<void> {
  const orderData = {
    payment: buyer.getData().payment!,
    email: buyer.getData().email,
    phone: buyer.getData().phone,
    address: buyer.getData().address,
    items: cart.getCart().map((item) => item.id),
    total: cart.priceCart(),
  };

  try {
    await communication.sendOrder(orderData);

    cart.clearCart();
    buyer.clear();
    modal.close();

    const successElement = successView.render({ total: orderData.total });
    modal.render({ content: successElement });
  } catch (error) {
    contactsForm.render({
      ...buyer.getData(),
      valid: false,
      errors: "Ошибка при отправке заказа",
    });
    modal.render({ content: contactsForm.render() });
  }
}

async function loadCatalog(): Promise<void> {
  try {
    const response = await communication.getProducts();
    productsModel.setItems(response.items);
  } catch (error) {
    productsModel.setItems(apiProducts.items);
  }
}

loadCatalog();