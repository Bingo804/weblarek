import { Card, ICardData } from "./Card";
import { ensureElement } from "../../utils/utils";

export interface ICardBasketData extends ICardData {
  index: number;
  deleteHandler: () => void;
}

export class CardBasket extends Card<ICardBasketData> {
  private indexElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.indexElement = ensureElement<HTMLElement>(
      ".basket__item-index",
      container,
    );
    this.deleteButton = ensureElement<HTMLButtonElement>(
      ".basket__item-delete",
      container,
    );
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set deleteHandler(callback: () => void) {
    this.deleteButton.onclick = (e) => {
      e.stopPropagation();
      callback();
    };
  }
}
