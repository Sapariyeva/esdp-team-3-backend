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
        const { offset, limit, manager_id, customer_id, performer_id } = params;

        const queryBuilder = this.createQueryBuilder("order");

        if (manager_id !== null) {
            queryBuilder.andWhere("order.manager_id = :manager_id", { manager_id });
        }

        if (customer_id !== null) {
            queryBuilder.andWhere("order.customer_id = :customer_id", { customer_id });
        }

        // Раскомментировать когда будет готов performerOrder
        // if (performer_id !== null) {
        //     queryBuilder.innerJoin("performer_order", "po", "po.order_id = order.id")
        //         .andWhere("po.performer_id = :performer_id", { performer_id });
        // }

        const totalItems = await queryBuilder.getCount();
        const orders = await queryBuilder.skip(offset).take(limit).getMany();
        const links = this.getLinks({
            totalItems,
            offset,
            limit,
            manager: manager_id,
            customer: customer_id,
            performer: performer_id
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
