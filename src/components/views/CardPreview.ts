import { Card, ICardData } from "./Card";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";
import { IEvents } from "../base/Events";

export interface ICardPreviewData extends ICardData {
  image: string;
  category: string;
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreviewData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;
  protected buttonElement: HTMLButtonElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );
    this.descriptionElement = ensureElement<HTMLElement>(
      ".card__text",
      container,
    );
    this.buttonElement = ensureElement<HTMLButtonElement>(
      ".card__button",
      container,
    );

    this.buttonElement.addEventListener("click", (e) => {
      e.stopPropagation();
      this.events.emit("card:action");
    });
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;
    const cssClass = categoryMap[value as keyof typeof categoryMap];
    this.categoryElement.className = "card__category";
    if (cssClass) {
      this.categoryElement.classList.add(cssClass);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonText(value: string) {
    this.buttonElement.textContent = value;
  }

  set buttonDisabled(value: boolean) {
    this.buttonElement.disabled = value;
  }
}