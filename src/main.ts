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
import { IProduct } from "../src/types/index";

const events = new EventEmitter();

const productsModel = new Products(events);
const cart = new ShoppingCart(events);
const buyer = new Buyer(events);
const api = new Api(API_URL);
const communication = new CommunicationLayer(api);

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
let currentOrderForm: OrderForm | null = null;
let currentContactsForm: ContactsForm | null = null;

events.on("catalog:changed", () => {
  renderCatalog();
});

events.on("basket:changed", () => {
  header.counter = cart.quantityProduct();
});

events.on("basket:open", () => {
  openModalWithCart();
});

events.on("order:submit", () => {
  openContactsForm();
});

events.on("contacts:submit", async () => {
  await handleOrderSubmit();
});

events.on("order:payment-select", (data: { payment: "card" | "cash" }) => {
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

function renderCatalog(): void {
  const products = productsModel.getItems();
  const cardElements: HTMLElement[] = [];

  products.forEach((product) => {
    const clone = cloneTemplate(cardCatalogTemplate);
    const card = new CardCatalog(clone);

    card.render({
      id: product.id,
      image: `${CDN_URL}/${product.image}`,
      title: product.title,
      price: product.price,
      category: product.category,
    });

    clone.addEventListener("click", () => {
      openProductPreview(product);
    });

    cardElements.push(clone);
  });

  gallery.catalog = cardElements;
}

function openProductPreview(product: IProduct): void {
  const clone = cloneTemplate(cardPreviewTemplate);
  const preview = new CardPreview(clone);

  const hasPrice = product.price !== null && product.price > 0;
  const inCart = cart.hasProduct(product.id);

  let buttonText = "В корзину";
  let buttonDisabled = false;

  if (!hasPrice) {
    buttonText = "Недоступно";
    buttonDisabled = true;
  } else if (inCart) {
    buttonText = "Удалить из корзины";
  }

  preview.render({
    id: product.id,
    image: `${CDN_URL}/${product.image}`,
    title: product.title,
    price: product.price,
    category: product.category,
    description: product.description || "Описание товара",
    buttonText: buttonText,
    buttonDisabled: buttonDisabled,
  });

  preview.buttonHandler = () => {
    if (!hasPrice) return;

    if (cart.hasProduct(product.id)) {
      cart.deleteProduct(product.id);
    } else {
      cart.addToCart(product);
    }
    modal.close();
  };

  modal.render({ content: clone });
}

function openModalWithCart(): void {
  const clone = cloneTemplate(basketTemplate);
  const cartView = new CartView(clone);

  const items = cart.getCart();
  const itemElements: HTMLElement[] = [];

  items.forEach((item, index) => {
    const itemClone = cloneTemplate(cardBasketTemplate);
    const cardBasket = new CardBasket(itemClone);

    cardBasket.render({
      id: item.id,
      title: item.title,
      price: item.price,
      index: index + 1,
      deleteHandler: () => {
        cart.deleteProduct(item.id);
        openModalWithCart();
      },
    });

    itemElements.push(itemClone);
  });

  cartView.render({
    items: itemElements,
    total: cart.priceCart(),
    buttonDisabled: cart.quantityProduct() === 0,
  });

  cartView.orderHandler = () => {
    openOrderForm();
  };

  modal.render({ content: clone });
}

function openOrderForm(): void {
  const fragment = orderTemplate.content.cloneNode(true) as DocumentFragment;
  const form = fragment.querySelector("form.form") as HTMLElement;
  if (!form) return;

  const orderForm = new OrderForm(form, events);
  const data = buyer.getData();
  orderForm.address = data.address;
  orderForm.payment = data.payment;

  modal.render({ content: form });
}

function openContactsForm(): void {
  const fragment = contactsTemplate.content.cloneNode(true) as DocumentFragment;
  const form = fragment.querySelector("form.form") as HTMLElement;
  if (!form) return;

  const contactsForm = new ContactsForm(form, events);
  const data = buyer.getData();
  contactsForm.email = data.email;
  contactsForm.phone = data.phone;

  modal.render({ content: form });
}

async function handleOrderSubmit(): Promise<void> {
  // Проверяем что все поля заполнены
  if (!buyer.isValid()) {
    console.warn("Форма не валидна");
    return;
  }

  // Проверяем что корзина не пуста
  if (cart.quantityProduct() === 0) {
    console.warn("Корзина пуста");
    return;
  }

  // Собираем данные для отправки
  const orderData = {
    payment: buyer.getData().payment!,
    email: buyer.getData().email,
    phone: buyer.getData().phone,
    address: buyer.getData().address,
    items: cart.getCart().map((item) => item.id),
    total: cart.priceCart(),
  };

  console.log("Отправка заказа:", orderData);

  try {
    // Отправляем на сервер
    const response = await communication.sendOrder(orderData);
    console.log("Сервер ответил:", response);

    // Очищаем корзину и данные покупателя
    cart.clearCart();
    buyer.clear();

    // Закрываем модалку
    modal.close();

    // Показываем окно успеха
    openSuccessModal(orderData.total);
  } catch (error) {
    console.error("❌ Ошибка:", error);
    // Показываем ошибку в форме
    if (currentContactsForm) {
      currentContactsForm.errors = "Ошибка при отправке заказа";
    }
  }
}

function openSuccessModal(total: number): void {
  const clone = cloneTemplate(successTemplate);
  const successView = new SuccessView(clone, () => modal.close());
  successView.render({ total });
  modal.render({ content: clone });
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
