import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface IModalData {
  content: HTMLElement;
}

export class Modal extends Component<IModalData> {
  private closeButton: HTMLElement;
  private contentElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLElement>(".modal__close", container);
    this.contentElement = ensureElement<HTMLElement>(
      ".modal__content",
      container,
    );

    this.closeButton.addEventListener("click", () => this.close());

    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });
  }

  set content(value: HTMLElement) {
    this.contentElement.replaceChildren(value);
  }

  open(): void {
    this.container.classList.add("modal_active");
  }

  close(): void {
    this.container.classList.remove("modal_active");
    this.contentElement.innerHTML = "";
  }

  render(data: IModalData): HTMLElement {
    this.content = data.content;
    this.open();
    return this.container;
  }
}
