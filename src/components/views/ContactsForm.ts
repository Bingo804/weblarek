import { Form, IFormData } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;

  private _email: string = "";
  private _phone: string = "";

  constructor(container: HTMLElement, events: IEvents) {
    super(container, events);

    this.emailInput = ensureElement<HTMLInputElement>(
      '[name="email"]',
      container,
    );
    this.phoneInput = ensureElement<HTMLInputElement>(
      '[name="phone"]',
      container,
    );

    this.emailInput.addEventListener("input", () => {
      this._email = this.emailInput.value.trim();
      this.updateUI();
      this.events.emit("contacts:email-input", { email: this._email });
    });

    this.phoneInput.addEventListener("input", () => {
      this._phone = this.phoneInput.value.trim();
      this.updateUI();
      this.events.emit("contacts:phone-input", { phone: this._phone });
    });
  }

  private updateUI(): void {
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this._email);
    const phoneValid = /^\+?[0-9\s\-()]{10,18}$/.test(this._phone);

    this.valid = emailValid && phoneValid;

    if (!emailValid) {
      this.errors = "Введите корректный email";
    } else if (!phoneValid) {
      this.errors = "Введите корректный телефон";
    } else {
      this.errors = "";
    }
  }

  set email(value: string) {
    this._email = value;
    this.emailInput.value = value;
    this.updateUI();
  }

  set phone(value: string) {
    this._phone = value;
    this.phoneInput.value = value;
    this.updateUI();
  }
}
