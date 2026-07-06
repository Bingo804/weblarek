import { Component } from "../base/Component";
import { categoryMap } from "../../utils/constants";

export interface ICardCatalogData {
  id: string;
  image: string;
  title: string;
  price: number;
  category: string;
}

export class CardCatalog extends Component<ICardCatalogData> {
  private imageElement: HTMLImageElement;
  private categoryElement: HTMLElement;
  private titleElement: HTMLElement;
  private priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.imageElement = container.querySelector(
      ".card__image",
    ) as HTMLImageElement;
    this.categoryElement = container.querySelector(
      ".card__category",
    ) as HTMLElement;
    this.titleElement = container.querySelector(".card__title") as HTMLElement;
    this.priceElement = container.querySelector(".card__price") as HTMLElement;

    if (!this.imageElement) throw new Error(".card__image не найден");
    if (!this.categoryElement) throw new Error(".card__category не найден");
    if (!this.titleElement) throw new Error(".card__title не найден");
    if (!this.priceElement) throw new Error(".card__price не найден");
  }

  render(data: ICardCatalogData): HTMLElement {
    this.imageElement.src = data.image;
    this.imageElement.alt = data.title;
    this.categoryElement.textContent = data.category;
    this.titleElement.textContent = data.title;
    this.priceElement.textContent = `${data.price} синапсов`;

    const cssClass = categoryMap[data.category as keyof typeof categoryMap];
    if (cssClass) this.categoryElement.classList.add(cssClass);

    return this.container;
  }
}
