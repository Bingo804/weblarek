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
import { Modal } from "./components/views/Modal";
import { CartView } from "./components/views/CardView";
import { OrderForm, IOrderData } from "./components/views/OrderForm";
import { ContactsForm, IContactsData } from "./components/views/ContactsForm";
import { SuccessView } from "./components/views/SuccessView";

const events = new EventEmitter();

//МОДЕЛИ

const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log("getItems:", productsModel.getItems());

const cart = new ShoppingCart();
const buyer = new Buyer();

const api = new Api(API_URL);
const communication = new CommunicationLayer(api);
const productsCatalog = new Products();

//ШАПКА

const headerContainer = document.querySelector(
  ".header__container",
) as HTMLElement;
const header = new Header(events, headerContainer);
header.render({ counter: 0 });

//МОДАЛКА

const modalContainer = document.querySelector(
  "#modal-container",
) as HTMLElement;
const modal = new Modal(modalContainer);

events.on("basket:open", () => {
  openCartModal();
});

events.on<IOrderData>("order:submit", (data) => {
  buyer.setAddress(data.address);
  buyer.setPayment(data.payment as "card" | "cash");
  openContactsForm();
});

events.on<IContactsData>("contacts:submit", async (data) => {
  buyer.setEmail(data.email);
  buyer.setPhone(data.phone);

  if (!buyer.validate()) return;

  const orderData = {
    ...buyer.getData(),
    items: cartItems.map((item) => item.id),
    total: getTotalPrice(),
  };

  try {
    clearCart();
    buyer.clear();
    openSuccessModal(orderData.total);
  } catch (error) {
    console.error(error);
  }
});

//СОБЫТИЕ КОРЗИНЫ

document.addEventListener("cart:remove", (e: any) => {
  const { id } = e.detail;
  console.log(`Удаление товара ${id} из корзины`);
  removeFromCart(id);
  openCartModal();
});

document.addEventListener("cart:order", () => {
  console.log("Оформление заказа");
  openOrderForm();
});

//КОРЗИНА

let cartItems: any[] = [];

function addToCart(product: any): void {
  if (!cartItems.some((item) => item.id === product.id)) {
    cartItems.push(product);
    cart.addToCart(product);
    header.render({ counter: cartItems.length });
    console.log(`Добавлен: ${product.title}`);
  }
}

function removeFromCart(id: string): void {
  cartItems = cartItems.filter((item) => item.id !== id);
  cart.deleteProduct(id);
  header.render({ counter: cartItems.length });
  console.log(`Удален: ${id}`);
}

function isInCart(id: string): boolean {
  return cartItems.some((item) => item.id === id);
}

function getTotalPrice(): number {
  return cartItems.reduce((sum, item) => sum + item.price, 0);
}

function clearCart(): void {
  cartItems = [];
  cart.clearCart();
  header.render({ counter: 0 });
}

//ОТКРЫТИЕ КОРЗИНЫ

function openCartModal(): void {
  const template = document.querySelector("#basket") as HTMLTemplateElement;
  const clone = template.content.firstElementChild?.cloneNode(
    true,
  ) as HTMLElement;
  if (!clone) return;

  const cartView = new CartView(clone);
  cartView.render({
    items: cartItems,
    total: getTotalPrice(),
  });

  const orderButton = clone.querySelector(
    ".basket__button",
  ) as HTMLButtonElement;
  if (orderButton) {
    orderButton.addEventListener("click", () => {
      openOrderForm();
    });
  }

  modal.render(clone);
}

//ФОРМА ЗАКАЗА

function openOrderForm(): void {
  const template = document.querySelector("#order") as HTMLTemplateElement;

  if (!template) {
    console.error("Шаблон #order не найден");
    return;
  }

  const clone = template.content.cloneNode(true) as DocumentFragment;
  const form = clone.querySelector("form.form") as HTMLElement;

  if (!form) {
    console.error("Форма в #order не найдена");
    return;
  }

  const orderForm = new OrderForm(form as HTMLElement, events);
  orderForm.render({
    address: "",
    payment: null,
  });

  modal.render(form);
}

//ФОРМА КОНТАКТОВ

function openContactsForm(): void {
  const template = document.querySelector("#contacts") as HTMLTemplateElement;

  if (!template) {
    console.error("Шаблон #contacts не найден");
    return;
  }

  const fragment = template.content.cloneNode(true) as DocumentFragment;
  const form = fragment.querySelector("form.form") as HTMLElement;

  if (!form) {
    console.error("Форма в #contacts не найдена");
    return;
  }

  const contactsForm = new ContactsForm(form, events);
  contactsForm.render({
    email: "",
    phone: "",
  });

  modal.render(form);
}

//МОДАЛКА УСПЕШНОГО ОФОРМЛЕНИЯ

function openSuccessModal(total: number): void {
  const template = document.querySelector("#success") as HTMLTemplateElement;
  const clone = template.content.firstElementChild?.cloneNode(
    true,
  ) as HTMLElement;
  if (!clone) return;

  const successView = new SuccessView(clone);
  successView.render({ total });
  successView.onClose(() => modal.close());

  modal.render(clone);
}

//ПРЕДПРОСМОТР ТОВАРА

function openProductModal(product: any): void {
  const template = document.querySelector(
    "#card-preview",
  ) as HTMLTemplateElement;
  const clone = template.content.firstElementChild?.cloneNode(
    true,
  ) as HTMLElement;
  if (!clone) return;

  const image = clone.querySelector(".card__image") as HTMLImageElement;
  const category = clone.querySelector(".card__category") as HTMLElement;
  const title = clone.querySelector(".card__title") as HTMLElement;
  const description = clone.querySelector(".card__text") as HTMLElement;
  const price = clone.querySelector(".card__price") as HTMLElement;
  const button = clone.querySelector(".card__button") as HTMLButtonElement;

  if (image) {
    image.src = `${CDN_URL}/${product.image}`;
    image.alt = product.title;
  }

  if (category) {
    category.textContent = product.category || "другое";
    category.className = "card__category";
    const catMap: Record<string, string> = {
      "софт-скил": "card__category_soft",
      "хард-скил": "card__category_hard",
      кнопка: "card__category_button",
      дополнительное: "card__category_additional",
      другое: "card__category_other",
    };
    const cssClass = catMap[product.category];
    if (cssClass) category.classList.add(cssClass);
  }

  if (title) title.textContent = product.title;
  if (description)
    description.textContent = product.description || "Описание товара";

  const hasPrice =
    product.price !== undefined && product.price !== null && product.price > 0;
  if (price) {
    price.textContent = hasPrice ? `${product.price} синапсов` : "Бесплатно";
  }

  if (button) {
    if (!hasPrice) {
      button.textContent = "Недоступно";
      button.disabled = true;
      button.onclick = null;
    } else {
      const inCart = isInCart(product.id);
      if (inCart) {
        button.textContent = "Удалить из корзины";
        button.disabled = false;
        button.onclick = (e) => {
          e.stopPropagation();
          removeFromCart(product.id);
          modal.close();
        };
      } else {
        // Текст "В корзину" из шаблона — НЕ МЕНЯЕМ!
        button.disabled = false;
        button.onclick = (e) => {
          e.stopPropagation();
          addToCart(product);
          modal.close();
        };
      }
    }
  }

  modal.render(clone);
}

//РЕНДЕРИНГ КАТАЛОГА

function renderCatalog(products: any[]): void {
  const template = document.querySelector(
    "#card-catalog",
  ) as HTMLTemplateElement;
  const galleryContainer = document.querySelector(".gallery") as HTMLElement;

  if (!template || !galleryContainer) {
    console.error("Шаблон или галерея не найдены");
    return;
  }

  const cardElements: HTMLElement[] = [];

  products.forEach((product) => {
    const clone = template.content.firstElementChild?.cloneNode(
      true,
    ) as HTMLElement;
    if (!clone) return;

    const card = new CardCatalog(clone);
    card.render({
      id: product.id,
      image: `${CDN_URL}/${product.image}`,
      title: product.title,
      price: product.price,
      category: product.category,
    });

    clone.addEventListener("click", () => {
      openProductModal(product);
    });

    cardElements.push(clone);
  });

  const gallery = new Gallery(galleryContainer);
  gallery.render({ catalog: cardElements });

  console.log(`Отрендерено ${cardElements.length} карточек`);
}

//ЗАГРУЗКА ДАННЫХ С СЕРВЕРА

async function loadCatalog() {
  try {
    console.log("Загрузка каталога...");
    const response = await communication.getProducts();
    const productsArray = response.items;
    productsCatalog.setItems(productsArray);
    console.log("Каталог загружен:", productsCatalog.getItems());
    renderCatalog(productsArray);
  } catch (error) {
    console.error("Ошибка:", error);
    console.warn("Использую локальные данные");
    renderCatalog(apiProducts.items);
  }
}

//ЗАПУСК

loadCatalog();
