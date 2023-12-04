import { IOrder } from "./IOrder.interface";

export interface IOrderList {
    orders: IOrder[];
    totalItems: number;
    totalPages: number;
    links: Record<string, string | null>;
}