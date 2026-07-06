import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

export interface IContactsData {
  email: string;
  phone: string;
}

export class ContactsForm extends Component<IContactsData> {
  private form: HTMLFormElement;
  private emailInput: HTMLInputElement;
  private phoneInput: HTMLInputElement;
  private submitButton: HTMLButtonElement;
  private errorsElement: HTMLElement;

  constructor(
    container: HTMLElement,
    private events: IEvents,
  ) {
    super(container);

    this.form = container as HTMLFormElement;
    this.emailInput = this.form.querySelector('[name="email"]')!;
    this.phoneInput = this.form.querySelector('[name="phone"]')!;
    this.submitButton = this.form.querySelector('button[type="submit"]')!;
    this.errorsElement = this.form.querySelector(".form__errors")!;

    this.initEvents();
    this.validate();
  }

  private initEvents(): void {
    this.emailInput.addEventListener("input", () => this.validate());
    this.phoneInput.addEventListener("input", () => this.validate());

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();

      if (this.submitButton.disabled) return;

      this.events.emit<IContactsData>("contacts:submit", {
        email: this.emailInput.value.trim(),
        phone: this.phoneInput.value.trim(),
      });
    });
  }

  private validate(): void {
    const email = this.emailInput.value.trim();
    const phone = this.phoneInput.value.trim();

    const validEmail = email.includes("@") && email.includes(".");

    const validPhone = phone.replace(/\D/g, "").length >= 10;

    this.submitButton.disabled = !(validEmail && validPhone);

    if (!validEmail) {
      this.errorsElement.textContent = "Введите корректный email";
      return;
    }

    if (!validPhone) {
      this.errorsElement.textContent = "Введите телефон";
      return;
    }

    this.errorsElement.textContent = "";
  }

  render(data: IContactsData): HTMLElement {
    this.emailInput.value = data.email ?? "";
    this.phoneInput.value = data.phone ?? "";

    this.validate();

    return this.container;
  }
}
