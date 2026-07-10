import { Component } from "../base/Component";
import { IEvents } from "../base/Events";
import { ensureElement } from "../../utils/utils";

export interface IFormData {
  valid: boolean;
  errors: string;
}

export abstract class Form<T extends IFormData> extends Component<T> {
  protected submitButton: HTMLButtonElement;
  protected errorsElement: HTMLElement;
  protected events: IEvents;

  constructor(container: HTMLFormElement, events: IEvents) {
    super(container);
    this.events = events;

    this.submitButton = ensureElement<HTMLButtonElement>(
      'button[type="submit"]',
      container,
    );
    this.errorsElement = ensureElement<HTMLElement>(".form__errors", container);

    this.container.addEventListener("submit", (e) => {
      e.preventDefault();
      const form = this.container as HTMLFormElement;
      this.events.emit(`${form.name}:submit`);
    });
  }

  set valid(value: boolean) {
    this.submitButton.disabled = !value;
  }

  set errors(value: string) {
    this.errorsElement.textContent = value;
  }
}
