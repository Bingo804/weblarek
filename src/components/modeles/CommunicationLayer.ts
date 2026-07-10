import {
  IProductsResponse,
  IOrderData,
  IOrderResponse,
} from "../../types/index.ts";
import { IApi } from "../../types/index.ts";

export class CommunicationLayer {
  constructor(private api: IApi) {}

  getProducts(): Promise<IProductsResponse> {
    return this.api.get<IProductsResponse>("/product");
  }

  sendOrder(orderData: IOrderData): Promise<IOrderResponse> {
    return this.api.post<IOrderResponse>("/order", orderData);
  }
}
