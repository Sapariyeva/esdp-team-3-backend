import { EOrderStatus } from '@/enum/EOrderStatus.enum';
export interface IOrder {
    id: number;
    customerId: number;
    serviceId: number;
    createdAt?: string;
    orderData: string;
    address: string;
    description: string;
    performersQuantity: number;
    timeWorked?: number;
    income?: number;
    performerPayment?: number;
    tax?: number;
    profit?: number;
    lat: number;
    lng: number;
    managerId?: number;
    managerCommentary?: string;
    status?: EOrderStatus;
}
