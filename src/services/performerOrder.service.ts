
import { PerformerOrderDto } from '../dto/performerOrder.dto';
import { OrderResponseDto } from '../dto/orderResponse.dto';

import { ArrivalNotificationDto } from '../dto/arrivalNotification.dto';
import { CompletionNotificationDto } from '../dto/completionNotification.dto';
import { PerformerOrderRepository } from '../repositories/performerOrder.repository';
import { OrderRejectionDto } from '../dto/OrderRejectionDto';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';

export class PerformerOrderService {
  private repository: PerformerOrderRepository;

  constructor(repository: PerformerOrderRepository) {
    this.repository = repository;
    
  }

  createPerformerOrder = async (performerOrderDto: PerformerOrderDto): Promise<IPerformerOrder | null> => {
    return await this.repository.createPerformerOrder(performerOrderDto);
  }

  updatePerformerOrderStart = async (orderId: number, performerId: number, start: Date): Promise<IPerformerOrder | null> => {
    return await this.repository.updatePerformerOrderStart(orderId, performerId, start);
  }

  updatePerformerOrderEnd = async (orderId: number, performerId: number, end: Date): Promise<IPerformerOrder | null> => {
    return await this.repository.updatePerformerOrderEnd(orderId, performerId, end);
  }

  updatePerformerOrderDisable = async (orderId: number, performerId: number, disable: boolean): Promise<IPerformerOrder | null> => {
    return await this.repository.updatePerformerOrderDisable(orderId, performerId, disable);
  }

  respondToOrder = async (responseDto: OrderResponseDto): Promise<IPerformerOrder> => {
    const performerOrderDto = new PerformerOrderDto();
    performerOrderDto.order_id = responseDto.order_id;
    performerOrderDto.performer_id = responseDto.performer_id;

    const newPerformerOrder = await this.repository.createPerformerOrder(performerOrderDto);

    return newPerformerOrder;
  }

  rejectOrder = async (rejectionDto: OrderRejectionDto): Promise<IPerformerOrder | null> => {
    const { order_id, performer_id } = rejectionDto;

    const updatedOrder = await this.repository.updatePerformerOrderDisable(order_id, performer_id, true);

    return updatedOrder;
  }

  notifyArrival = async (arrivalDto: ArrivalNotificationDto): Promise<IPerformerOrder | null> => {
    const { order_id, performer_id, start } = arrivalDto;

    const updatedOrder = await this.repository.updatePerformerOrderStart(order_id, performer_id, start);

    return updatedOrder;
  }

  notifyCompletion = async (completionDto: CompletionNotificationDto): Promise<IPerformerOrder | null> => {
    const { order_id, performer_id, end } = completionDto;

    const updatedOrder = await this.repository.updatePerformerOrderEnd(order_id, performer_id, end);

    return updatedOrder;
  }
}