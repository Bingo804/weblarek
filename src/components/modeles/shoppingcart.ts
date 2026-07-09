import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class ShoppingCart {
  private buyerCart: IProduct[] = [];
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  addToCart(product: IProduct): boolean {
    if (product.price === null) {
      return false;
    }
    if (this.hasProduct(product.id)) {
      return false;
    }
    this.buyerCart.push(product);
    this.events.emit("basket:changed", { items: this.buyerCart });
    return true;
  }

  getCart(): IProduct[] {
    return this.buyerCart;
  }

  deleteProduct(id: string): void {
    this.buyerCart = this.buyerCart.filter((product) => product.id !== id);
    this.events.emit("basket:changed", { items: this.buyerCart });
  }

  clearCart(): void {
    this.buyerCart = [];
    this.events.emit("basket:changed", { items: this.buyerCart });
  }

  priceCart(): number {
    return this.buyerCart.reduce((total, item) => total + (item.price || 0), 0);
  }

  quantityProduct(): number {
    return this.buyerCart.length;
  }

  hasProduct(id: string): boolean {
    return this.buyerCart.some((item) => item.id === id);
  }
}
