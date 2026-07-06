import { Component } from "../base/Component";

export class Modal extends Component<HTMLElement> {
  private closeButton: HTMLElement;
  private contentElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.closeButton = container.querySelector(".modal__close") as HTMLElement;
    this.contentElement = container.querySelector(
      ".modal__content",
    ) as HTMLElement;

    if (!this.closeButton) throw new Error(".modal__close не найден");
    if (!this.contentElement) throw new Error(".modal__content не найден");

    this.initEvents();
  }

  private initEvents(): void {
    this.closeButton.addEventListener("click", () => this.close());

    this.container.addEventListener("click", (e) => {
      if (e.target === this.container) {
        this.close();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.isOpen()) {
        this.close();
      }
    });
  }

  render(content: HTMLElement): HTMLElement {
    this.contentElement.innerHTML = "";
    this.contentElement.appendChild(content);
    this.open();
    return this.container;
  }

  private open(): void {
    this.container.classList.add("modal_active");
    document.body.style.overflow = "hidden";
  }

  public close(): void {
    this.container.classList.remove("modal_active");
    document.body.style.overflow = "";
    this.contentElement.innerHTML = "";
  }

  private isOpen(): boolean {
    return this.container.classList.contains("modal_active");
  }
}
