import { User } from "../entities/user.entity";

export interface IPerformerOrder {
    id: number;
    performer_id: number;
    order_id: number;
    start: Date;
    end: Date;
    disable: boolean;
    performer_rating: number;
    customer_rating: number;
  performer: User
}