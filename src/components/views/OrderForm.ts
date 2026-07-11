import { Form, IFormData } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";
import { TPayment } from "../../types/index";

export interface IOrderFormData extends IFormData {
  address: string;
  payment: TPayment | null;
}

export class OrderForm extends Form<IOrderFormData> {
  protected addressInput: HTMLInputElement;
  protected cardBtn: HTMLButtonElement;
  protected cashBtn: HTMLButtonElement;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>('[name="address"]', container);
    this.cardBtn = ensureElement<HTMLButtonElement>('[name="card"]', container);
    this.cashBtn = ensureElement<HTMLButtonElement>('[name="cash"]', container);

    this.cardBtn.addEventListener("click", () => {
      this.events.emit("order:payment-select", { payment: "card" });
    });

    this.cashBtn.addEventListener("click", () => {
      this.events.emit("order:payment-select", { payment: "cash" });
    });

    this.addressInput.addEventListener("input", () => {
      this.events.emit("order:address-input", {
        address: this.addressInput.value,
      });
    });
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set payment(value: TPayment | null) {
    this.cardBtn.classList.remove("button_alt");
    this.cashBtn.classList.remove("button_alt");

    if (value === "card") this.cardBtn.classList.add("button_alt");
    if (value === "cash") this.cashBtn.classList.add("button_alt");
  }
}