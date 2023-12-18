import { IOrder } from "./IOrder.interface";
import { IUserWithoutPass } from "./IUser.interface";

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