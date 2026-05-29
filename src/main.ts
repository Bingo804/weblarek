import "./scss/styles.scss";
import { Products } from "./components/modeles/products.ts";
import { ShoppingCart } from "./components/modeles/shoppingcart.ts";
import { Buyer } from "./components/modeles/buyer.ts";
import { CommunicationLayer } from "./components/modeles/CommunicationLayer.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "../src/utils/constants.ts";
import { apiProducts } from "./utils/data.ts";

const productsModel = new Products();
productsModel.setItems(apiProducts.items);
console.log("getItems:", productsModel.getItems());
productsModel.setCard("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
console.log("getCard:", productsModel.getCard());

const cart = new ShoppingCart();
const testProduct = apiProducts.items[0];
cart.addToCart(testProduct);
console.log("getCart:", cart.getCart());
console.log("quantityProduct:", cart.quantityProduct());
console.log("priceCart:", cart.priceCart());
console.log("hasProduct:", cart.hasProduct(testProduct.id));
cart.deleteProduct(testProduct.id);
console.log("deleteProduct:", cart.getCart());
cart.addToCart(testProduct);
cart.clearCart();
console.log("clearCart:", cart.getCart());

const buyer = new Buyer();
buyer.setEmail("test@yandex..ru");
buyer.setPhone("+7920002323");
buyer.setAddress("Moscow");
buyer.setPayment("card");
console.log("getData:", buyer.getData());
buyer.clear();
console.log("clear:", buyer.getData());

const api = new Api(API_URL);
const communication = new CommunicationLayer(api);
const productsCatalog = new Products();

async function loadCatalog() {
  try {
    const response = await communication.getProducts();
    const productsArray = response.items;
    productsCatalog.setItems(productsArray);
    console.log("Каталог с сервера загружен:", productsCatalog.getItems());
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
}

loadCatalog();
