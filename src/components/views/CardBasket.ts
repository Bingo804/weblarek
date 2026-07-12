import { Card, ICardData } from "./Card";
import { ensureElement } from "../../utils/utils";

export interface ICardBasketData extends ICardData {
  index: number;
}

export class CardBasket extends Card<ICardBasketData> {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement, onDelete: () => void) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(".basket__item-index", container);
    this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);

    this.deleteButton.addEventListener("click", (e) => {
      e.stopPropagation();
      onDelete();
    });
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}