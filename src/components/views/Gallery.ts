import { Component } from "../base/Component";

export interface GalleryData {
  catalog: HTMLElement[];
}

export class Gallery extends Component<GalleryData> {
  catalogElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);
    this.catalogElement = container;
  }

  set catalog(items: HTMLElement[]) {
    this.catalogElement.replaceChildren(...items);
  }

  render(data: GalleryData): HTMLElement {
    this.catalog = data.catalog;
    return this.container;
  }
}
