import { Component } from "../base/Component.ts";

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
    this.catalogElement.innerHTML = "";
    items.forEach((item) => {
      this.catalogElement.appendChild(item);
    });
  }

  render(data: GalleryData): HTMLElement {
    this.catalog = data.catalog;
    return this.container;
  }
}
