import { Repository } from 'typeorm';
import { appDataSource } from '../dataSource';
import { Order } from '../entities/order.entity';
import { IOrder } from '../interfaces/IOrder.interface';
import { EOrderStatus } from '../enum/EOrderStatus.enum';
import { OrderDto } from '../dto/order.dto';
import { IOrderList } from '../interfaces/IOrderList.interface';
import { IGetOrderParams } from '../interfaces/IGetOrderParams';

export class OrderRepository extends Repository<Order> {
    constructor() {
        super(Order, appDataSource.createEntityManager());
    }

    async getOrders(params: IGetOrderParams): Promise<IOrderList> {
        const { offset, limit, managerId, customerId, performerId } = params;

        const queryBuilder = this.createQueryBuilder("order");

        if (managerId !== null) {
            queryBuilder.andWhere("order.managerId = :managerId", { managerId });
        }

        if (customerId !== null) {
            queryBuilder.andWhere("order.customerId = :customerId", { customerId });
        }

        // Раскомментировать когда будет готов performerOrder
        // if (performerId !== null) {
        //     queryBuilder.innerJoin("performer_order", "po", "po.orderId = order.id")
        //         .andWhere("po.performerId = :performerId", { performerId });
        // }

        const totalItems = await queryBuilder.getCount();
        const orders = await queryBuilder.skip(offset).take(limit).getMany();
        const links = this.getLinks({
            totalItems,
            offset,
            limit,
            manager: managerId,
            customer: customerId,
            performer: performerId
        });

        return { orders, totalItems, totalPages: Math.ceil(totalItems / limit), links };
    }

    getLinks(params: {
        totalItems: number,
        offset: number,
        limit: number,
        manager?: number | null,
        customer?: number | null,
        performer?: number | null
    }): Record<string, string | null> {
        const { totalItems, offset, limit, manager, customer, performer } = params;
        const totalPages = Math.ceil(totalItems / limit);
        const linkStr = `/order?${manager ? `manager=${manager}&` : ''}${customer ? `customer=${customer}&` : ''}${performer ? `performer=${performer}&` : ''}`;
        const links: Record<string, string | null> = {
            next: offset + limit < totalItems ? `${linkStr}offset=${offset + limit}&limit=${limit}` : null,
            prev: offset - limit >= 0 ? `${linkStr}offset=${offset - limit}&limit=${limit}` : null,
            first: `${linkStr}offset=0&limit=${limit}`,
            last: `${linkStr}offset=${(totalPages - 1) * limit}&limit=${limit}`
        };

        for (let page = 1; page <= totalPages; page++) {
            const pageOffset = (page - 1) * limit;
            links[`page${page}`] = `${linkStr}offset=${pageOffset}&limit=${limit}`;
        }

        return links;
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
