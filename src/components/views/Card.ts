import { Component } from "../base/Component";
import { ensureElement } from "../../utils/utils";

export interface ICardData {
  id: string;
  image: string;
  title: string;
  price: number | null;
  category: string;
  description?: string;
  buttonText?: string;
  buttonDisabled?: boolean;
}

export abstract class Card<
  T extends ICardData = ICardData,
> extends Component<T> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;
  protected descriptionElement?: HTMLElement;
  protected buttonElement?: HTMLButtonElement;

  constructor(
    container: HTMLElement,
    protected buttonSelector?: string,
  ) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );
    this.titleElement = ensureElement<HTMLElement>(".card__title", container);
    this.priceElement = ensureElement<HTMLElement>(".card__price", container);

    this.descriptionElement =
      container.querySelector(".card__text") || undefined;

    if (buttonSelector) {
      this.buttonElement = ensureElement<HTMLButtonElement>(
        buttonSelector,
        container,
      );
    }
  }

  set image(value: string) {
    if (this.imageElement) {
      this.imageElement.src = value;
    }
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      value !== null ? `${value} синапсов` : "Бесценно";
  }

  set description(value: string) {
    if (this.descriptionElement) {
      this.descriptionElement.textContent = value;
    }
  }

  set buttonText(value: string) {
    if (this.buttonElement) {
      this.buttonElement.textContent = value;
    }
  }

  set buttonDisabled(value: boolean) {
    if (this.buttonElement) {
      this.buttonElement.disabled = value;
    }
  }

  set buttonHandler(callback: () => void) {
    if (this.buttonElement) {
      this.buttonElement.onclick = (e) => {
        e.stopPropagation();
        callback();
      };
    }
  }

  set categoryClass(cssClass: string) {
    this.categoryElement.className = "card__category";
    if (cssClass) {
      this.categoryElement.classList.add(cssClass);
    }
  }
}
