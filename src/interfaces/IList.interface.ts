import { IOrder } from '@/interfaces/IOrder.interface';
import { IUserWithoutPass } from '@/interfaces/IUser.interface';

interface IList {
    totalItems: number;
    totalPages: number;
    links: Record<string, string | null>;
}

export interface IOrderList extends IList {
    orders: IOrder[];
}

export interface IUserList extends IList {
    users: IUserWithoutPass[];
}