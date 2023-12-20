import { Repository } from 'typeorm';
import { appDataSource } from '../dataSource';
import { Order } from '../entities/order.entity';
import { IOrder } from '../interfaces/IOrder.interface';
import { EOrderStatus } from '../enum/EOrderStatus.enum';
import { OrderDto } from '../dto/order.dto';
import { IOrderList } from '../interfaces/IList.interface';
import { IGetOrderParams } from '../interfaces/IGetParams';
import { getLinks } from '../helpers/getLinks';

export class OrderRepository extends Repository<Order> {
    constructor() {
        super(Order, appDataSource.createEntityManager());
    }

    async getOrders(params: IGetOrderParams): Promise<IOrderList> {
        const { offset, limit, manager, customer, status } = params;

        const queryBuilder = this.createQueryBuilder("order");

        if (manager) {
            queryBuilder.andWhere("order.managerId = :manager", { manager });
        }

        if (customer) {
            queryBuilder.andWhere("order.customerId = :customer", { customer });
        }

        // Раскомментировать когда будет готов performerOrder
        // if (performer) {
        //     queryBuilder.innerJoin("performer_order", "po", "po.orderId = order.id")
        //         .andWhere("po.performerId = :performer", { performer });
        // }

        if (status) {
            queryBuilder.andWhere("order.status = :status", { status });
        }

        const totalItems = await queryBuilder.getCount();
        const orders = await queryBuilder.skip(offset).take(limit).getMany();
        const links = getLinks({ ...params, totalItems }, 'order');

        return { orders, totalItems, totalPages: Math.ceil(totalItems / limit), links };
    }

    async getOrderById(id: number): Promise<IOrder | null> {
        return await this.findOne({
            where: { id }
        })
    }

    async createOrder(data: OrderDto): Promise<IOrder> {
        const order = new Order();
        order.address = data.address;
        order.customerId = data.customerId;
        order.serviceId = data.serviceId
        order.orderData = data.orderData;
        order.performersQuantity = data.performersQuantity;
        order.lat = data.lat;
        order.lng = data.lng;
        order.managerId = data.managerId;
        order.status = EOrderStatus.IN_PROGRESS;
        order.description = data.description;
        const savedOrder = await this.save(order);
        return savedOrder;
    }

    async cancelOrder(id: number): Promise<IOrder | null> {
        const updatedOrder = await this.update({ id }, { status: EOrderStatus.CANCELED });
        if (updatedOrder.affected && updatedOrder.affected > 0) {
            return updatedOrder.raw[0] as IOrder;
        } else {
            return null;
        }
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
