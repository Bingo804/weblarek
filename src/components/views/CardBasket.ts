import { Card, ICardData } from "./Card";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface ICardBasketData extends ICardData {
  index: number;
  productId: string;
}

export class CardBasket extends Card<ICardBasketData> {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;
  private events: IEvents;
  private _productId: string = "";

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.indexElement = ensureElement<HTMLElement>(".basket__item-index", container);
    this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

    this.deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      this.events.emit("basket:remove", { productId: this._productId });
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set productId(value: string) {
    this._productId = value;
  }
}