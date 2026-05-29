import { IProduct } from "../../types/index.ts";

export class Products {
  protected productArr: IProduct[] = [];
  protected productCard: IProduct | null = null;

  getProductById(id: string): IProduct | undefined {
    return this.productArr.find((product) => product.id === id);
  }

  setItems(items: IProduct[]): void {
    this.productArr = items;
  }

  getItems(): IProduct[] {
    return this.productArr;
  }

  setCard(id: string): void {
    const card = this.getProductById(id);
    if (card !== undefined) {
      this.productCard = card;
    } else {
      console.error("Данная карточка не обнаружена");
      this.productCard = null;
    }
  }
  getCard(): IProduct | null {
    return this.productCard;
  }
}
