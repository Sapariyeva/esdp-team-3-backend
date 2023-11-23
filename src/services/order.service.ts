import { OrderRepository } from '../repositories/order.repository';
import { IOrder } from '../interfaces/IOrder.interface';
import { EOrderStatus } from '../interfaces/EOrderStatus.enum';
import { OrderDto } from '../dto/order.dto';

export class OrderService {
    private repository: OrderRepository;

    constructor() {
        this.repository = new OrderRepository();
    }

    getOrders = async (): Promise<IOrder[]> => {
        return await this.repository.getOrders();
    }

    getOrderById = async (order_id: number): Promise<IOrder | null> => {
        return await this.repository.getOrderById(order_id);
    }

    getOrdersByManager = async (manager_id: number): Promise<IOrder[]> => {
        return await this.repository.getOrdersByManager(manager_id);
    }

    getOrdersByCustomer = async (customer_id: number): Promise<IOrder[]> => {
        return await this.repository.getOrdersByCustomer(customer_id);
    }

    getOrdersByPerformer = async (performer_id: number): Promise<IOrder[]> => {
        return await this.repository.getOrdersByPerformer(performer_id);
    }

    createOrder = async (orderDto: OrderDto): Promise<IOrder | null> => {
        return await this.repository.createOrder(orderDto);
    }

    changeOrderStatus = async (id: number, status: EOrderStatus): Promise<IOrder | null> => {
        return await this.repository.changeOrderStatus(id, status);
    }
}
