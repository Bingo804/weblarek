import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IFormData {
  valid: boolean;
  errors: string;
}

export abstract class Form<T extends IFormData> extends Component<T> {
  protected form: HTMLFormElement;
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLElement, events: IEvents) {
    super(container);
    this.events = events;

    this.form = container as HTMLFormElement;
    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );
    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    this.form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!this.submitButton.disabled) {
        this.events.emit(`${this.form.name}:submit`);
      }
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
