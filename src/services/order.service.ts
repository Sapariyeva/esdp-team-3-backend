import { OrderRepository } from '../repositories/order.repository';
import { IOrder } from '../interfaces/IOrder.interface';
import { EOrderStatus } from '../enum/EOrderStatus.enum';
import { OrderDto } from '../dto/order.dto';
import { IOrderList } from '../interfaces/IList.interface';
import { IGetOrderParams } from '../interfaces/IGetParams';

export class OrderService {
    private repository: OrderRepository;

    constructor() {
        this.repository = new OrderRepository();
    }

    getOrders = async (params: IGetOrderParams): Promise<IOrderList> => {
        return await this.repository.getOrders(params);
    }

    getOrderById = async (orderId: number): Promise<IOrder | null> => {
        return await this.repository.getOrderById(orderId);
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
