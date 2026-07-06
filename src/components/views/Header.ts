import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";
import { IEvents } from "../base/Events";

export interface IHeader {
  counter: Number;
}

export class Header extends Component<IHeader> {
  protected basketButton: HTMLButtonElement;
  protected counterElement: HTMLElement;
  protected events: IEvents;
  constructor(events: IEvents, container: HTMLElement) {
    super(container);
    this.events = events;
    this.counterElement = ensureElement<HTMLElement>(
      ".header__basket-counter",
      this.container,
    );
    this.basketButton = ensureElement<HTMLButtonElement>(
      ".header__basket",
      this.container,
    );
    this.basketButton.addEventListener("click", () => {
      this.events.emit("basket:open");
    });
  }
  set counter(value: Number) {
    this.counterElement.textContent = String(value);
  }
}
