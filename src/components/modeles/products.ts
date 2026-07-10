import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class Products {
  protected productArr: IProduct[] = [];
  protected productCard: IProduct | null = null;
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  getProductById(id: string): IProduct | undefined {
    return this.productArr.find((product) => product.id === id);
  }

  setItems(items: IProduct[]): void {
    this.productArr = items;
    this.events.emit("catalog:changed");
  }

  getItems(): IProduct[] {
    return this.productArr;
  }

  setCard(id: string): void {
    const card = this.getProductById(id);
    if (card !== undefined) {
      this.productCard = card;
    } else {
      this.productCard = null;
    }
    this.events.emit("catalog:card-changed");
  }

  getCard(): IProduct | null {
    return this.productCard;
  }
}
