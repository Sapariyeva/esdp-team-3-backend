import { Repository } from 'typeorm';
import { appDataSource } from '@/dataSource';
import { Order } from '@/entities/order.entity';
import { IOrder } from '@/interfaces/IOrder.interface';
import { EOrderStatus } from '@/enum/EOrderStatus.enum';
import { OrderDto } from '@/dto/order.dto';
import { IOrderList } from '@/interfaces/IList.interface';
import { IGetOrderParams } from '@/interfaces/IGetParams';
import { getLinks } from '@/helpers/getLinks';

export class OrderRepository extends Repository<Order> {
    constructor() {
        super(Order, appDataSource.createEntityManager());
    }

    async getOrders(params: IGetOrderParams): Promise<IOrderList> {
        const {
            offset,
            limit,
            service,
            manager,
            customer,
            performer,
            status,
            sortBy,
            sortOrder
        } = params;

        const queryBuilder = this.createQueryBuilder("order")
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('order.manager', 'manager')
            .leftJoinAndSelect('order.performerOrders', 'performerOrder')
            .leftJoinAndSelect('performerOrder.performer', 'performer');

        if (service) {
            queryBuilder.andWhere("order.serviceId = :service", { service });
        }

        if (manager) {
            queryBuilder.andWhere("order.managerId = :manager", { manager });
        }

        if (customer) {
            queryBuilder.andWhere("order.customerId = :customer", { customer });
        }

        if (performer) {
            queryBuilder
                .leftJoin('order.performerOrders', 'otherPerformerOrder')
                .andWhere('otherPerformerOrder.performerId = :performer', { performer });
        }

        if (status) {
            queryBuilder.andWhere("order.status = :status", { status });
        }

        if (sortBy && sortOrder) {
            if (sortBy === 'manager' || sortBy === 'customer' || sortBy === 'performer') {
                queryBuilder.orderBy(`${sortBy}.displayName`, sortOrder);
            } else {
                queryBuilder.orderBy(`order.${sortBy}`, sortOrder);
            }
        }

        const totalItems = await queryBuilder.getCount();
        const orders = await queryBuilder.skip(offset).take(limit).getMany();
        const links = getLinks({ ...params, totalItems }, 'order');

        return { orders, totalItems, totalPages: Math.ceil(totalItems / limit), links };
    }

    async getOrderById(id: number): Promise<IOrder | null> {
        const order = await this.createQueryBuilder('order')
            .leftJoinAndSelect('order.service', 'service')
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('order.manager', 'manager')
            .leftJoinAndSelect('order.performerOrders', 'performerOrder')
            .leftJoinAndSelect('performerOrder.performer', 'performer')
            .where("order.id = :id", { id })
            .getOne();
        return order;
    }

    async getOrdersCSV(): Promise<Order[]> {
        const orders = await this.createQueryBuilder('order')
            .leftJoinAndSelect('order.service', 'service')
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('order.manager', 'manager')
            .leftJoinAndSelect('order.performerOrders', 'performerOrder')
            .leftJoinAndSelect('performerOrder.performer', 'performer')
            .getMany();
        return orders;
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
