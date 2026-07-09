import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ISuccessData {
  total: number;
}

export class SuccessView extends Component<ISuccessData> {
  private description: HTMLElement;
  private closeButton: HTMLButtonElement;
  private onCloseCallback: () => void;

  constructor(container: HTMLElement, onClose: () => void) {
    super(container);
    this.onCloseCallback = onClose;

    this.description = ensureElement<HTMLElement>(
      ".order-success__description",
      container,
    );
    this.closeButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      container,
    );

    this.closeButton.addEventListener("click", () => {
      this.onCloseCallback();
    });
  }

  set total(value: number) {
    this.description.textContent = `Списано ${value} синапсов`;
  }

  render(data: ISuccessData): HTMLElement {
    this.total = data.total;
    return this.container;
  }
}
