import { Card, ICardData } from "./Card";
import { categoryMap } from "../../utils/constants";

export interface ICardCatalogData extends ICardData {}

export class CardCatalog extends Card<ICardCatalogData> {
  constructor(container: HTMLElement) {
    super(container);
  }

  set category(value: string) {
    super.category = value;
    const cssClass = categoryMap[value as keyof typeof categoryMap];
    this.categoryClass = cssClass || "";
  }
}
