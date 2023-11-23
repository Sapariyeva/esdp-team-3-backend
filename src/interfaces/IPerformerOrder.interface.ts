export interface IPerformerOrder {
    id: number;
    performer_id: number;
    order_id: number;
    start: string;
    end: string;
    disable: boolean;
    performer_rating: number;
    customer_rating: number;
}