import { Repository } from 'typeorm';
import { appDataSource } from '../dataSource';
import { Order } from '../entities/order.entity';
import { IOrder } from '../interfaces/IOrder.interface';
import { EOrderStatus } from '../interfaces/EOrderStatus.enum';
import { OrderDto } from '../dto/order.dto';

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

    async createOrder(data: OrderDto): Promise<IOrder> {
        const order = new Order();
        order.address = data.address;
        order.customer_id = data.customer_id;
        order.service_id = data.service_id
        order.order_data = data.order_data;
        order.performers_quantity = data.performers_quantity;
        order.lat = data.lat;
        order.lng = data.lng;
        order.manager_id = data.manager_id;
        order.status = EOrderStatus.IN_PROGRESS;
        const savedOrder = await this.save(order);
        return savedOrder;
    }

    async changeOrderStatus(id: number, status: EOrderStatus): Promise<IOrder | null> {
        const updatedOrder = await this.update({ id }, { status });
        if (updatedOrder.affected && updatedOrder.affected > 0) {
            return updatedOrder.raw[0] as IOrder;
        } else {
            return null;
        }
    }
}
