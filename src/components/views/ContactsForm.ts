import { Form, IFormData } from "./Form";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IContactsFormData extends IFormData {
  email: string;
  phone: string;
}

export class ContactsForm extends Form<IContactsFormData> {
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;

  constructor(container: HTMLFormElement, events: IEvents) {
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
      this.events.emit("contacts:email-input", {
        email: this.emailInput.value,
      });
    });

    this.phoneInput.addEventListener("input", () => {
      this.events.emit("contacts:phone-input", {
        phone: this.phoneInput.value,
      });
    });
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }
}