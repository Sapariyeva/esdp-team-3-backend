import { Repository } from 'typeorm';
import { appDataSource } from '../dataSource';
import { Order } from '../entities/order.entity';
import { IOrder } from '../interfaces/IOrder.interface';
import { EOrderStatus } from '../interfaces/EOrderStatus.enum';
import { OrderDto } from '../dto/order.dto';
import { IOrderList } from '../interfaces/IOrderList.interface';

export class OrderRepository extends Repository<Order> {
    constructor() {
        super(Order, appDataSource.createEntityManager());
    }

    async getOrders(offset: number, limit: number): Promise<IOrderList> {
        const totalItems = await this.count();
        const orders = await this.find({ skip: offset, take: limit });
        const links = this.getLinks(totalItems, offset, limit);
        return { orders, totalItems, totalPages: Math.ceil(totalItems / limit), links };
    }

    getLinks(totalItems: number, offset: number, limit: number, manager: number | null = null, customer: number | null = null, performer: number | null = null): Record<string, string | null> {
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

    async getOrdersByManager(manager_id: number, offset: number, limit: number): Promise<IOrderList> {
        const totalItems = await this.count({ where: { manager_id } });
        const orders = await this.find({
            where: { manager_id },
            skip: offset, take: limit
        });
        const links = this.getLinks(totalItems, offset, limit, manager_id);
        return { orders, totalItems, totalPages: Math.ceil(totalItems / limit), links };
    }

    async getOrdersByCustomer(customer_id: number, offset: number, limit: number): Promise<IOrderList> {
        const totalItems = await this.count({ where: { customer_id } });
        const orders = await this.find({
            where: { customer_id },
            skip: offset, take: limit
        });
        const links = this.getLinks(totalItems, offset, limit, null, customer_id);
        return { orders, totalItems, totalPages: Math.ceil(totalItems / limit), links };
    }

    async getOrdersByPerformer(performer_id: number, offset: number, limit: number): Promise<IOrderList> {
        const totalItems = await this.createQueryBuilder("order")
            .innerJoin("performer_order", "po", "po.order_id = order.id")
            .where("po.performer_id = :performer_id", { performer_id })
            .getCount();
        const orders = await this.createQueryBuilder("order")
            .innerJoin("performer_order", "po", "po.order_id = order.id")
            .where("po.performer_id = :performer_id", { performer_id })
            .skip(offset)
            .take(limit)
            .getMany();
        const links = this.getLinks(totalItems, offset, limit, null, null, performer_id);
        return { orders, totalItems, totalPages: Math.ceil(totalItems / limit), links };
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
