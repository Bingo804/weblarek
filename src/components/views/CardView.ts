import { Component } from "../base/Component";

export interface ICartData {
  items: any[];
  total: number;
}

export class CartView extends Component<ICartData> {
  private list: HTMLElement;
  private totalPrice: HTMLElement;
  private orderButton: HTMLButtonElement;

  constructor(container: HTMLElement) {
    super(container);
    this.list = container.querySelector(".basket__list") as HTMLElement;
    this.totalPrice = container.querySelector(".basket__price") as HTMLElement;
    this.orderButton = container.querySelector(
      ".basket__button",
    ) as HTMLButtonElement;
  }

  render(data: ICartData): HTMLElement {
    if (data.items.length === 0) {
      this.list.innerHTML = "<li>Корзина пуста</li>";
      if (this.totalPrice) this.totalPrice.textContent = "0 синапсов";
      if (this.orderButton) this.orderButton.disabled = true;
    } else {
      this.list.innerHTML = "";
      data.items.forEach((item, index) => {
        const template = document.querySelector(
          "#card-basket",
        ) as HTMLTemplateElement;
        const clone = template.content.firstElementChild?.cloneNode(
          true,
        ) as HTMLElement;
        if (!clone) return;

        const idx = clone.querySelector(".basket__item-index") as HTMLElement;
        const title = clone.querySelector(".card__title") as HTMLElement;
        const price = clone.querySelector(".card__price") as HTMLElement;
        const deleteBtn = clone.querySelector(
          ".basket__item-delete",
        ) as HTMLButtonElement;

        if (idx) idx.textContent = String(index + 1);
        if (title) title.textContent = item.title;
        if (price) price.textContent = `${item.price} синапсов`;

        if (deleteBtn) {
          deleteBtn.addEventListener("click", (e) => {
            e.stopPropagation();
            const event = new CustomEvent("cart:remove", {
              detail: { id: item.id },
            });
            document.dispatchEvent(event);
          });
        }

        this.list.appendChild(clone);
      });

      const total = data.total;
      if (this.totalPrice) this.totalPrice.textContent = `${total} синапсов`;
      if (this.orderButton) this.orderButton.disabled = false;
    }

    if (this.orderButton) {
      this.orderButton.onclick = () => {
        document.dispatchEvent(new CustomEvent("cart:order"));
      };
    }

    return this.container;
  }
}
