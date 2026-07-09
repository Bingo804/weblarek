import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICartData {
  items: HTMLElement[];
  total: number;
  buttonDisabled: boolean;
}

export class CartView extends Component<ICartData> {
  private list: HTMLElement;
  private totalPrice: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);

    this.list = ensureElement<HTMLElement>(".basket__list", container);
    this.totalPrice = ensureElement<HTMLElement>(".basket__price", container);
    this.orderButton = ensureElement<HTMLButtonElement>(
      ".basket__button",
      container,
    );
  }

  set items(elements: HTMLElement[]) {
    this.list.replaceChildren(...elements);
  }

  set total(value: number) {
    this.totalPrice.textContent = `${value} синапсов`;
  }

  set buttonDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }

  set orderHandler(callback: () => void) {
    this.orderButton.onclick = callback;
  }
}
