import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { ArrivalNotificationDto } from '../dto/arrivalNotification.dto';
import { CompletionNotificationDto } from '../dto/completionNotification.dto';
import { OrderResponseDto } from '../dto/orderResponse.dto';
import { PerformerOrderService } from '../services/performerOrder.service';
import { PerformerOrderRepository } from '../repositories/performerOrder.repository';
import { OrderRejectionDto } from '../dto/orderRejection.dto';
import { OrderRepository } from '../repositories/order.repository';

export class PerformerOrderController {
	private repository: PerformerOrderRepository;
	private service: PerformerOrderService;
	private orderRepository: OrderRepository;

	constructor() {
		this.repository = new PerformerOrderRepository();
		this.service = new PerformerOrderService(this.repository);
		this.orderRepository = new OrderRepository();
	}

	respondToOrder: RequestHandler = async (req, res, next): Promise<void> => {
		try {
			const responseDto = plainToInstance(OrderResponseDto, req.body);
			const order = await this.orderRepository.findOne({ where: { id: responseDto.order_id } });
			if (!order) {
				res.status(400).send({
					success: false,
					message: 'there is no such order'
				});
			}
			// добавить проверку наличия такого исполнителя
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