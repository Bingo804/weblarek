import { Products } from "./components/modeles/products.ts";
import { CommunicationLayer } from "./components/base/CommunicationLayer.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL } from "../src/utils/constants.ts";

const api = new Api(API_URL);
const communication = new CommunicationLayer(api);

async function loadCatalog() {
  try {
    const productsCatalog = new Products();
    const productsArray = await communication.getProducts();

    productsCatalog.setItems(productsArray);

    console.log("Каталог загружен:", productsCatalog);
    console.log("Массив товаров:", productsCatalog.getItems());

    // Проверка работы с карточками
    if (productsArray.length > 0) {
      const firstProductId = productsArray[0].id;
      productsCatalog.setCard(firstProductId);
      console.log("Выбранная карточка:", productsCatalog.getCard());
    }
  } catch (error) {
    console.error("Ошибка при загрузке каталога:", error);
  }
}

loadCatalog();
