import { Card, ICardData } from "./Card";

export interface ICardPreviewData extends ICardData {
  description: string;
  buttonText: string;
  buttonDisabled: boolean;
}

export class CardPreview extends Card<ICardPreviewData> {
  constructor(container: HTMLElement) {
    super(container, ".card__button");
  }

  set category(value: string) {
    super.category = value;
  }
}
