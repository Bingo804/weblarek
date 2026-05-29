import { IBuyer, ValidationErrors, TPayment } from "../../types/index.ts";

export class Buyer {
  private data: IBuyer = {
    payment: null,
    email: "",
    phone: "",
    address: "",
  };

  setPayment(payment: TPayment) {
    this.data.payment = payment;
  }

  setEmail(email: string) {
    this.data.email = email;
  }

  setPhone(phone: string) {
    this.data.phone = phone;
  }

  setAddress(address: string) {
    this.data.address = address;
  }

  getData(): IBuyer {
    return this.data;
  }

  clear() {
    this.data = {
      payment: null,
      email: "",
      phone: "",
      address: "",
    };
  }

  validate(): ValidationErrors {
    const errors: ValidationErrors = {};

    if (this.data.payment === null) {
      errors.payment = "Не выбран вид оплаты";
    }

    if (this.data.email === "") {
      errors.email = "Email не указан";
    }

    if (this.data.phone === "") {
      errors.phone = "Телефон не указан";
    }

    if (this.data.address === "") {
      errors.address = "Адрес не указан";
    }
    return errors;
  }
}
