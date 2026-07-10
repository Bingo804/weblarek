import { Card, ICardData } from "./Card";
import { ensureElement } from "../../utils/utils";
import { categoryMap } from "../../utils/constants";

export interface ICardCatalogData extends ICardData {
  image: string;
  category: string;
}

export class CardCatalog extends Card<ICardCatalogData> {
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;

  constructor(container: HTMLElement, onClick: () => void) {
    super(container);

    this.imageElement = ensureElement<HTMLImageElement>(
      ".card__image",
      container,
    );
    this.categoryElement = ensureElement<HTMLElement>(
      ".card__category",
      container,
    );

    container.addEventListener("click", onClick);
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
}
