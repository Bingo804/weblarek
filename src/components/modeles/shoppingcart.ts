import { IProduct } from "../../types/index.ts";
import { Products } from "../modeles/products.ts";

export class ShoppingCart {
  private _buyerCart: IProduct[] = [];
  private productsModel: Products;

  constructor(productsModel: Products) {
    this.productsModel = productsModel;
  }

  addToCart(id: string): boolean {
    const product = this.productsModel
      .getItems()
      .find((product) => product.id === id);

    if (product === undefined) {
      console.error("Товар не найден");
      return false;
    }

    if (product.price === null) {
      console.error("Цена не указана, товар нельзя добавить");
      return false;
    }

    this._buyerCart.push(product);
    return true;
  }

  getCart(): IProduct[] {
    return this._buyerCart;
  }

  deleteProduct(id: string): void {
    const wasPresent = this.hasProduct(id);
    if (wasPresent) {
      this._buyerCart = this._buyerCart.filter((product) => product.id !== id);
    } else {
      console.error("Данного товара нет в корзине");
    }
  }

  clearCart(): void {
    this._buyerCart = [];
  }

  priceCart(): number {
    let total = 0;
    this._buyerCart.forEach((result) => {
      if (result.price !== null) {
        total += result.price;
      } else {
        console.error("Товар не продается");
      }
    });
    return total;
  }
  quantityProduct(): number {
    return this._buyerCart.length;
  }

  hasProduct(id: string): boolean {
    const list = this._buyerCart.find((product) => product.id === id);
    if (list !== undefined) {
      return true;
    } else {
      return false;
    }
  }
}
