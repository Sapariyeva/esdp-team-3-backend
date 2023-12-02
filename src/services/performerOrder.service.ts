import { OrderResponseDto } from '../dto/orderResponse.dto';
import { ArrivalNotificationDto } from '../dto/arrivalNotification.dto';
import { CompletionNotificationDto } from '../dto/completionNotification.dto';
import { PerformerOrderRepository } from '../repositories/performerOrder.repository';
import { OrderRejectionDto } from '../dto/orderRejection.dto';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { EPerformerOrderStatus } from '../interfaces/EPerformerOrderStatus.enum';
import { validate } from 'class-validator';

export class PerformerOrderService {
	private repository: PerformerOrderRepository;

	constructor(repository: PerformerOrderRepository) {
		this.repository = repository;
	}

	respondToOrder = async (responseDto: OrderResponseDto): Promise<IPerformerOrder> => {
		const errors = await validate(responseDto);
		if (errors.length) throw errors;
		return await this.repository.createPerformerOrder(responseDto);
	}

	rejectOrder = async (rejectionDto: OrderRejectionDto): Promise<IPerformerOrder | null> => {
		const { order_id, performer_id } = rejectionDto;
		const performerOrder = await this.repository.updatePerformerOrderStatus(order_id, performer_id, EPerformerOrderStatus.BANNED);
		console.log(performerOrder)
		// return this.repository.findOne({ where: { order_id, performer_id } });
		return performerOrder;
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