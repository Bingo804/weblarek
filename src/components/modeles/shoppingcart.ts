import { IProduct } from "../../types/index.ts";

export class ShoppingCart {
  private buyerCart: IProduct[] = [];

  addToCart(product: IProduct): boolean {
    if (product.price === null) {
      console.error("Цена не указана, товар нельзя добавить");
      return false;
    }

    this.buyerCart.push(product);
    return true;
  }

  getCart(): IProduct[] {
    return this.buyerCart;
  }

  deleteProduct(id: string): void {
    this.buyerCart = this.buyerCart.filter((product) => product.id !== id);
  }

  clearCart(): void {
    this.buyerCart = [];
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
