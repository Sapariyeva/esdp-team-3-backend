import { Repository } from 'typeorm';
import { appDataSource } from '../dataSource';
import { Order } from '../entities/order.entity';
import { IOrder } from '../interfaces/IOrder.inteface';

export class OrderRepository extends Repository<Order> {
    constructor() {
        super(Order, appDataSource.createEntityManager());
    }

    async getOrders(): Promise<IOrder[]> {
        return await this.find();
    }

    async getOrderById(id: number): Promise<IOrder | null> {
        return await this.findOne({
            where: { id }
        })
    }

    async getOrdersByManager(manager_id: number): Promise<IOrder[]> {
        return await this.find({
            where: { manager_id }
        });
    }

    async getOrdersByCustomer(customer_id: number): Promise<IOrder[]> {
        return await this.find({
            where: { customer_id }
        });
    }

    async getOrdersByPerformer(performer_id: number): Promise<IOrder[]> {
        return await this.createQueryBuilder("order")
            .innerJoin("performer_order", "po", "po.order_id = order.id")
            .where("po.performer_id = :performer_id", { performer_id })
            .getMany();
    }
}
