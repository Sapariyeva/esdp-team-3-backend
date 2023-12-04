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

	deletePerformerOrder = async (deletionDto: OrderRejectionDto): Promise<void> => {
		const errors = await validate(deletionDto);
		if (errors.length) throw errors;
		const { order_id, performer_id } = deletionDto;

		await this.repository.delete({ order_id, performer_id });

		console.log(`PerformerOrder with order_id: ${order_id} and performer_id: ${performer_id} has been deleted.`);
	}

	rejectOrder = async (rejectionDto: OrderRejectionDto): Promise<IPerformerOrder | null> => {
		const errors = await validate(rejectionDto);
		if (errors.length) throw errors;
		const { order_id, performer_id } = rejectionDto;
		const performerOrder = await this.repository.updatePerformerOrderStatus(order_id, performer_id, EPerformerOrderStatus.BANNED);
		console.log(performerOrder)
		return performerOrder;
	}

	notifyArrival = async (arrivalDto: ArrivalNotificationDto): Promise<IPerformerOrder | null> => {
		const errors = await validate(arrivalDto);
		if (errors.length) throw errors;

		const { order_id, performer_id } = arrivalDto;

		const updatedOrder = await this.repository.updatePerformerOrderStatus(order_id, performer_id, EPerformerOrderStatus.AWAITING_CONFIRMATION);
		return updatedOrder;
	}

	notifyCompletion = async (completionDto: CompletionNotificationDto): Promise<IPerformerOrder | null> => {
		const errors = await validate(completionDto);
		if (errors.length) throw errors;

		const { order_id, performer_id, end } = completionDto;
		let updatedOrder = await this.repository.updatePerformerOrderEnd(order_id, performer_id, end);

		if (updatedOrder) {
			updatedOrder.status = EPerformerOrderStatus.DONE;
			await this.repository.save(updatedOrder);
		}

		return updatedOrder;
	}
}