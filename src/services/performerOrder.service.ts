
import { PerformerOrderDto } from '../dto/performerOrder.dto';
import { OrderResponseDto } from '../dto/orderResponse.dto';
import { ArrivalNotificationDto } from '../dto/arrivalNotification.dto';
import { CompletionNotificationDto } from '../dto/completionNotification.dto';
import { PerformerOrderRepository } from '../repositories/performerOrder.repository';
import { OrderRejectionDto } from '../dto/OrderRejectionDto';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { EPerformerOrderStatus } from '../interfaces/EPerformerOrderStatus.enum';

export class PerformerOrderService {
  private repository: PerformerOrderRepository;

  constructor(repository: PerformerOrderRepository) {
    this.repository = repository;
    
  }
  

  createPerformerOrder = async (performerOrderDto: PerformerOrderDto): Promise<IPerformerOrder | null> => {
    const newOrder = await this.repository.createPerformerOrder(performerOrderDto);
    return this.repository.findOne({ where: { id: newOrder.id } });
  }

  respondToOrder = async (responseDto: OrderResponseDto): Promise<IPerformerOrder> => {
    const performerOrderDto = new PerformerOrderDto();
    performerOrderDto.order_id = responseDto.order_id;
    performerOrderDto.performer_id = responseDto.performer_id;
    performerOrderDto.status = EPerformerOrderStatus.WAITING;

    const existingOrder = await this.repository.getPerformerOrderByOrderIdAndPerformerId(responseDto.order_id, responseDto.performer_id);

    if (existingOrder) {
      throw new Error(`You have already responded to this order.`);
    }

    const newPerformerOrder = await this.repository.createPerformerOrder(performerOrderDto);

    return newPerformerOrder;
  }

  rejectOrder = async (rejectionDto: OrderRejectionDto): Promise<IPerformerOrder | null> => {
    const { order_id, performer_id } = rejectionDto;

    await this.repository.updatePerformerOrderStatus(order_id, performer_id, EPerformerOrderStatus.BANNED);
    return this.repository.findOne({ where: { order_id: order_id, performer_id: performer_id } });
  }

  notifyArrival = async (arrivalDto: ArrivalNotificationDto): Promise<IPerformerOrder | null> => {
    const { order_id, performer_id } = arrivalDto;

    await this.repository.updatePerformerOrderStatus(order_id, performer_id, EPerformerOrderStatus.AWAITING_CONFIRMATION);
    return this.repository.findOne({ where: { order_id: order_id, performer_id: performer_id } });
  }

  notifyCompletion = async (completionDto: CompletionNotificationDto): Promise<IPerformerOrder | null> => {
    const { order_id, performer_id, end } = completionDto;

    await this.repository.updatePerformerOrderEnd(order_id, performer_id, end);

    let updatedOrder = await this.repository.findOne({
      where: {
        order_id: order_id,
        performer_id: performer_id
      }
    });

    if (updatedOrder) {
      updatedOrder.status = EPerformerOrderStatus.DONE;
      await this.repository.save(updatedOrder);
    }

    return updatedOrder;
  }
}