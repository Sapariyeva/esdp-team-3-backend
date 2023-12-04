export interface IGetOrderParams {
    offset: number;
    limit: number;
    manager_id?: number | null;
    customer_id?: number | null;
    performer_id?: number | null;
}