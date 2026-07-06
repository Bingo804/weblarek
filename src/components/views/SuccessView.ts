import { Component } from "../base/Component";

export interface ISuccessData {
  total: number;
}

export class SuccessView extends Component<ISuccessData> {
  private description: HTMLElement;
  private closeButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.description = container.querySelector(
      ".order-success__description",
    ) as HTMLElement;
    this.closeButton = container.querySelector(
      ".order-success__close",
    ) as HTMLButtonElement;
  }

  render(data: ISuccessData): HTMLElement {
    if (this.description) {
      this.description.textContent = `Списано ${data.total} синапсов`;
    }
    return this.container;
  }

  onClose(callback: () => void): void {
    if (this.closeButton) {
      this.closeButton.addEventListener("click", callback);
    }
  }
}
