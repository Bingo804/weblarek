import { IProduct } from "../../types/index.ts";

export class Products {
  protected _productArr: IProduct[] = [];
  protected _productCard: IProduct | null = null;

  setItems(items: IProduct[]): void {
    this._productArr = items;
  }

  getItems(): IProduct[] {
    return this._productArr;
  }

  setCard(id: string): void {
    const card = this._productArr.find((product) => product.id === id);
    if (card !== undefined) {
      this._productCard = card;
    } else {
      console.error("Данная карточка не обнаружена");
      this._productCard = null;
    }
  }
  getCard(): IProduct | null {
    return this._productCard;
  }
}
