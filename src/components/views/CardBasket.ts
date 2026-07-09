import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICardBasketData {
  id: string;
  title: string;
  price: number | null;
  index: number;
  deleteHandler: () => void;
}

export class CardBasket extends Component<ICardBasketData> {
  private indexElement: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;
  private deleteButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    
    this.indexElement = ensureElement<HTMLElement>(".basket__item-index", container);
    this.titleElement = ensureElement<HTMLElement>(".card__title", container);
    this.priceElement = ensureElement<HTMLElement>(".card__price", container);
    this.deleteButton = ensureElement<HTMLButtonElement>(".basket__item-delete", container);
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent = value !== null ? `${value} синапсов` : "Бесценно";
  }

  set deleteHandler(callback: () => void) {
    this.deleteButton.onclick = (e) => {
      e.stopPropagation();
      callback();
    };
  }

  render(data: ICardBasketData): HTMLElement {
    this.index = data.index;
    this.title = data.title;
    this.price = data.price;
    this.deleteHandler = data.deleteHandler;
    return this.container;
  }
}