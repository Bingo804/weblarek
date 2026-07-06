import { Component } from '../base/Component';
import { IEvents } from '../base/Events';

export interface IOrderData {
	address: string;
	payment: 'card' | 'cash' | null;
}

export class OrderForm extends Component<IOrderData> {
	private form: HTMLFormElement;
	private addressInput: HTMLInputElement;
	private submitButton: HTMLButtonElement;
	private errorsElement: HTMLElement;
	private cardBtn: HTMLButtonElement;
	private cashBtn: HTMLButtonElement;
	private selectedPayment: 'card' | 'cash' | null = null;

	constructor(container: HTMLElement, private events: IEvents) {
		super(container);

		this.form = container as HTMLFormElement;
		this.addressInput = this.form.querySelector('[name="address"]')!;
		this.submitButton = this.form.querySelector('button[type="submit"]')!;
		this.errorsElement = this.form.querySelector('.form__errors')!;
		this.cardBtn = this.form.querySelector('[name="card"]')!;
		this.cashBtn = this.form.querySelector('[name="cash"]')!;

		this.initEvents();
		this.validate();
	}

	private initEvents(): void {
		this.cardBtn.addEventListener('click', () => {
			this.selectedPayment = 'card';

			this.cardBtn.classList.remove('button_alt');
			this.cashBtn.classList.add('button_alt');

			this.validate();
		});

		this.cashBtn.addEventListener('click', () => {
			this.selectedPayment = 'cash';

			this.cashBtn.classList.remove('button_alt');
			this.cardBtn.classList.add('button_alt');

			this.validate();
		});

		this.addressInput.addEventListener('input', () => this.validate());

		this.form.addEventListener('submit', (e) => {
			e.preventDefault();

			if (this.submitButton.disabled) return;

			this.events.emit<IOrderData>('order:submit', {
				address: this.addressInput.value.trim(),
				payment: this.selectedPayment
			});
		});
	}

	private validate(): void {
		const validAddress = this.addressInput.value.trim().length > 0;
		const validPayment = this.selectedPayment !== null;

		this.submitButton.disabled = !(validAddress && validPayment);

		if (!validAddress) {
			this.errorsElement.textContent = 'Введите адрес';
			return;
		}

		if (!validPayment) {
			this.errorsElement.textContent = 'Выберите способ оплаты';
			return;
		}

		this.errorsElement.textContent = '';
	}

	render(data: IOrderData): HTMLElement {
		this.addressInput.value = data.address ?? '';
		this.selectedPayment = data.payment;

		this.validate();

		return this.container;
	}
}