import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { ArrivalNotificationDto } from '../dto/arrivalNotification.dto';
import { CompletionNotificationDto } from '../dto/completionNotification.dto';
import { OrderResponseDto } from '../dto/orderResponse.dto';
import { PerformerOrderService } from '../services/performerOrder.service';
import { PerformerOrderRepository } from '../repositories/performerOrder.repository';
import { OrderRejectionDto } from '../dto/orderRejection.dto';
import { OrderRepository } from '../repositories/order.repository';
import { UserRepository } from '../repositories/user.repository';

export class PerformerOrderController {
  private repository: PerformerOrderRepository;
  private service: PerformerOrderService;
  private orderRepository: OrderRepository;
  private userRepository: UserRepository;

  constructor() {
    this.repository = new PerformerOrderRepository();
    this.service = new PerformerOrderService(this.repository);
    this.orderRepository = new OrderRepository();
    this.userRepository = new UserRepository();
  }


	respondToOrder: RequestHandler = async (req, res, next): Promise<void> => {
		try {
			const responseDto = plainToInstance(OrderResponseDto, req.body);
			const order = await this.orderRepository.findOne({ where: { id: responseDto.orderId } });
			if (!order) {
				res.status(400).send({
					success: false,
					message: 'there is no such order'
				});
			}
      const user = await this.userRepository.findOne({ where: { id: responseDto.performerId } });

      if (!user) {
        res.status(400).send({
          success: false,
          message: 'there is no such user'
        });
        return;
      }
      const orderResponse = await this.service.respondToOrder(responseDto);
      res.send(orderResponse);
    } catch (e) {
      next(e);
    }
  }

    deleteOrder: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const { id } = req.params;
            const deletionDto = plainToInstance(OrderRejectionDto, { id: Number(id) });
            await this.service.deletePerformerOrder(deletionDto);
            res.sendStatus(200);
        } catch (e) {
            next(e);
        }
    }

  rejectOrder: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { id } = req.params;
      const rejectionDto = plainToInstance(OrderRejectionDto, req.body);
      rejectionDto.id = Number(id);
      const orderRejection = await this.service.rejectOrder(rejectionDto);
      res.send(orderRejection);
    } catch (e) {
      next(e);
    }
  }

  notifyArrival: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { id } = req.params;
      const arrivalDto = plainToInstance(ArrivalNotificationDto, req.body);
      arrivalDto.id = Number(id);
      const arrivalNotification = await this.service.notifyArrival(arrivalDto);
      res.send(arrivalNotification);
    } catch (e) {
      next(e);
    }
  }

    notifyStart: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const { id } = req.params;
            const startDto = plainToInstance(CompletionNotificationDto, req.body);
            startDto.id = Number(id);
            const startNotification = await this.service.notifyStart(startDto);
            res.send(startNotification);
        } catch (e) {
            next(e);
        }
    }

  notifyCompletion: RequestHandler = async (req, res, next): Promise<void> => {
    try {
      const { id } = req.params;
      const completionDto = plainToInstance(CompletionNotificationDto, req.body);
      completionDto.id = Number(id);
      const completionNotification = await this.service.notifyCompletion(completionDto);
      res.send(completionNotification);
    } catch (e) {
      next(e);
    }
  }
}