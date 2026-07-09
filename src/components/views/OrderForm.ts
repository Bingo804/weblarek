import { Form, IFormData } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IOrderFormData extends IFormData {
  address: string;
  payment: "card" | "cash" | null;
}

export class OrderForm extends Form<IOrderFormData> {
  protected addressInput: HTMLInputElement;
  protected cardBtn: HTMLButtonElement;
  protected cashBtn: HTMLButtonElement;

  private _payment: "card" | "cash" | null = null;
  private _address: string = "";

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.addressInput = ensureElement<HTMLInputElement>(
      '[name="address"]',
      container,
    );
    this.cardBtn = ensureElement<HTMLButtonElement>('[name="card"]', container);
    this.cashBtn = ensureElement<HTMLButtonElement>('[name="cash"]', container);

    this.cardBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this._payment = "card";
      this.updateUI();
      this.events.emit("order:payment-select", { payment: "card" });
    });

    this.cashBtn.addEventListener("click", (e) => {
      e.preventDefault();
      this._payment = "cash";
      this.updateUI();
      this.events.emit("order:payment-select", { payment: "cash" });
    });

    this.addressInput.addEventListener("input", () => {
      this._address = this.addressInput.value.trim();
      this.updateUI();
      this.events.emit("order:address-input", { address: this._address });
    });
  }

  private updateUI(): void {
    this.cardBtn.classList.remove("button_alt");
    this.cashBtn.classList.remove("button_alt");
    if (this._payment === "card") this.cardBtn.classList.add("button_alt");
    if (this._payment === "cash") this.cashBtn.classList.add("button_alt");

    const isValid = this._payment !== null && this._address.length > 0;
    this.valid = isValid;

    if (!this._payment) {
      this.errors = "Выберите способ оплаты";
    } else if (!this._address) {
      this.errors = "Введите адрес";
    } else {
      this.errors = "";
    }
  }

  set address(value: string) {
    this._address = value;
    this.addressInput.value = value;
    this.updateUI();
  }

  set payment(value: "card" | "cash" | null) {
    this._payment = value;
    this.updateUI();
  }
}
