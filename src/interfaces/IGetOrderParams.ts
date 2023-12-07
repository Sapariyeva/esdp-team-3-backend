export interface IGetOrderParams {
    offset: number;
    limit: number;
    managerId?: number | null;
    customerId?: number | null;
    performerId?: number | null;
}