import { EOrderStatus } from "./EOrderStatus.enum";

export interface IOrder {
    id: number;
    customer_id: number;
    service_id: number;
    created_at?: string;
    order_data: string;
    address: string;
    performers_quantity: number;
    time_worked?: number;
    income?: number;
    performer_payment?: number;
    tax?: number;
    profit?: number;
    lat: number;
    lng: number;
    manager_id?: number;
    status?: EOrderStatus;
}
