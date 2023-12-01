import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';



import { ArrivalNotificationDto } from '../dto/arrivalNotification.dto';
import { CompletionNotificationDto } from '../dto/completionNotification.dto';
import { OrderResponseDto } from '../dto/orderResponse.dto';
import { PerformerOrderService } from '../services/performerOrder.service';
import { PerformerOrderRepository } from '../repositories/performerOrder.repository';
import { OrderRejectionDto } from '../dto/OrderRejectionDto';

export class PerformerOrderController {
  private repository: PerformerOrderRepository;
  private service: PerformerOrderService;

  constructor() {
    this.repository = new PerformerOrderRepository();
    this.service = new PerformerOrderService(this.repository);
  }
  
  createPerformerOrder: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const actualData = req.body;
      console.log(actualData);
      const performerOrder = await this.repository.createPerformerOrder(actualData);
      res.send(performerOrder);
    } catch (e) {
      next(e);
    }
  }


  startOrder: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { orderId, performerId, start } = req.body;
      const updatedOrder = await this.service.updatePerformerOrderStart(orderId, performerId, start);
      res.send(updatedOrder);
    } catch (e) {
      next(e);
    }
  }

  endOrder: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { orderId, performerId, end } = req.body;
      const updatedOrder = await this.service.updatePerformerOrderEnd(orderId, performerId, end);
      res.send(updatedOrder);
    } catch (e) {
      next(e);
    }
  }

  disableOrder: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { orderId, performerId, disable } = req.body;
      const updatedOrder = await this.service.updatePerformerOrderDisable(orderId, performerId, disable);
      res.send(updatedOrder);
    } catch (e) {
      next(e);
    }
  }
 

  respondToOrder: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const responseDto = plainToInstance(OrderResponseDto, req.body);
      const orderResponse = await this.service.respondToOrder(responseDto);
      res.send(orderResponse);
    } catch (e) {
      next(e);
    }
  }

  rejectOrder: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const rejectionDto = plainToInstance(OrderRejectionDto, req.body);
      const orderRejection = await this.service.rejectOrder(rejectionDto);
      res.send(orderRejection);
    } catch (e) {
      next(e);
    }
  }

  notifyArrival: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const arrivalDto = plainToInstance(ArrivalNotificationDto, req.body);
      const arrivalNotification = await this.service.notifyArrival(arrivalDto);
      res.send(arrivalNotification);
    } catch (e) {
      next(e);
    }
  }

  notifyCompletion: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const completionDto = plainToInstance(CompletionNotificationDto, req.body);
      const completionNotification = await this.service.notifyCompletion(completionDto);
      res.send(completionNotification);
    } catch (e) {
      next(e);
    }
  }
}