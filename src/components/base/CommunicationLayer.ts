import { Api } from "./Api.ts";
import {
  IProduct,
  IProductsResponse,
  IOrderData,
  IOrderResponse,
} from "../../types/index.ts";

export class CommunicationLayer {
  constructor(private api: Api) {}
  async getProducts(): Promise<IProduct[]> {
    const response = (await this.api.get("/product")) as IProductsResponse;

    if (response && response.items && Array.isArray(response.items)) {
      return response.items;
    }

    console.warn("Неожиданный формат ответа от сервера", response);
    return [];
  }

  async sendOrder(orderData: IOrderData): Promise<IOrderResponse> {
    return this.api.post("/order", orderData) as Promise<IOrderResponse>;
  }
}
