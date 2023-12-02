import { User } from "../entities/user.entity";
import { EPerformerOrderStatus } from "./EPerformerOrderStatus.enum";

export interface IPerformerOrder {
    id: number;
    performer_id: number;
    order_id: number;
    start: Date;
    end: Date;
    status: EPerformerOrderStatus;
    performer_rating: number;
    customer_rating: number;
    performer: User
}