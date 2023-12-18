import { OrderResponseDto } from '../dto/orderResponse.dto';
import { ArrivalNotificationDto } from '../dto/arrivalNotification.dto';
import { CompletionNotificationDto } from '../dto/completionNotification.dto';
import { PerformerOrderRepository } from '../repositories/performerOrder.repository';
import { OrderRejectionDto } from '../dto/orderRejection.dto';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { EPerformerOrderStatus } from '../enum/EPerformerOrderStatus.enum';
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
        const { id } = deletionDto;
        await this.repository.delete({ id });
        console.log(`PerformerOrder with id: ${id} has been deleted.`);
    }

    rejectOrder = async (rejectionDto: OrderRejectionDto): Promise<IPerformerOrder | null> => {
        const errors = await validate(rejectionDto);
        if (errors.length) throw errors;
        const { id } = rejectionDto;
        const performerOrder = await this.repository.updatePerformerOrderStatus(id, EPerformerOrderStatus.BANNED);
        console.log(performerOrder)
        return performerOrder;
    }

    notifyArrival = async (arrivalDto: ArrivalNotificationDto): Promise<IPerformerOrder | null> => {
        const errors = await validate(arrivalDto);
        if (errors.length) throw errors;

        const { id } = arrivalDto;


        const updatedOrder = await this.repository.updatePerformerOrderStatus(id, EPerformerOrderStatus.AWAITING_CONFIRMATION);
        return updatedOrder;
    }


    notifyStart = async (startDto: CompletionNotificationDto): Promise<IPerformerOrder | null> => {
        const errors = await validate(startDto);
        if (errors.length) throw errors;

        const { id } = startDto;
        const start = new Date().toISOString();
        let updatedOrder = await this.repository.updatePerformerOrderStart(id, start);


        if (updatedOrder) {
            updatedOrder.status = EPerformerOrderStatus.IN_PROGRESS;
            await this.repository.save(updatedOrder);
        }


        return updatedOrder;
    }


    notifyCompletion = async (completionDto: CompletionNotificationDto): Promise<IPerformerOrder | null> => {
        const errors = await validate(completionDto);
        if (errors.length) throw errors;

        const { id } = completionDto;
        const end = new Date().toISOString();
        let updatedOrder = await this.repository.updatePerformerOrderEnd(id, end);

        if (updatedOrder) {
            updatedOrder.status = EPerformerOrderStatus.DONE;
            await this.repository.save(updatedOrder);
        }

        return updatedOrder;
    }
}