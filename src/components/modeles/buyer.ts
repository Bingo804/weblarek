import { IBuyer, ValidationErrors, TPayment } from "../../types/index.ts";
import { IEvents } from "../base/Events";

export class Buyer {
  private data: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };
  protected events: IEvents;

  constructor(events: IEvents) {
    this.events = events;
  }

  setPayment(payment: TPayment): void {
    this.data.payment = payment;
    this.events.emit("buyer:changed");
  }

  setEmail(email: string): void {
    this.data.email = email;
    this.events.emit("buyer:changed");
  }

  setPhone(phone: string): void {
    this.data.phone = phone;
    this.events.emit("buyer:changed");
  }

  setAddress(address: string): void {
    this.data.address = address;
    this.events.emit("buyer:changed");
  }

  getData(): IBuyer {
    return this.data;
  }

  clear(): void {
    this.data = {
      payment: null,
      email: "",
      phone: "",
      address: "",
    };
    this.events.emit("buyer:changed");
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (this.data.payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (this.data.address.trim() === "") {
      errors.address = "Адрес не указан";
    }

    if (this.data.email.trim() === "") {
      errors.email = "Email не указан";
    }

    if (this.data.phone.trim() === "") {
      errors.phone = "Телефон не указан";
    }

    return errors;
  }
}
