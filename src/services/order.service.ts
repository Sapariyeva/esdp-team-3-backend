import { OrderRepository } from '../repositories/order.repository';
import { IOrder } from '../interfaces/IOrder.interface';
import { EOrderStatus } from '../interfaces/EOrderStatus.enum';
import { OrderDto } from '../dto/order.dto';
import { IOrderList } from '../interfaces/IOrderList.interface';

export class OrderService {
    private repository: OrderRepository;

    constructor() {
        this.repository = new OrderRepository();
    }

    getOrders = async (offset: number, limit: number): Promise<IOrderList> => {
        return await this.repository.getOrders(offset, limit);
    }

    getOrderById = async (order_id: number): Promise<IOrder | null> => {
        return await this.repository.getOrderById(order_id);
    }

    getOrdersByManager = async (manager_id: number, offset: number, limit: number): Promise<IOrderList> => {
        return await this.repository.getOrdersByManager(manager_id, offset, limit);
    }

    getOrdersByCustomer = async (customer_id: number, offset: number, limit: number): Promise<IOrderList> => {
        return await this.repository.getOrdersByCustomer(customer_id, offset, limit);
    }

    getOrdersByPerformer = async (performer_id: number, offset: number, limit: number): Promise<IOrderList> => {
        return await this.repository.getOrdersByPerformer(performer_id, offset, limit);
    }

    createOrder = async (orderDto: OrderDto): Promise<IOrder | null> => {
        return await this.repository.createOrder(orderDto);
    }

    cancelOrder = async (id: number): Promise<IOrder | null> => {
        return await this.repository.cancelOrder(id);
    }

    changeOrderStatus = async (id: number, status: EOrderStatus): Promise<IOrder | null> => {
        return await this.repository.changeOrderStatus(id, status);
    }
}
