import { Order } from '@/entities/order.entity';
import { User } from '@/entities/user.entity';
import { EPerformerOrderStatus } from '@/enum/EPerformerOrderStatus.enum';

export interface IPerformerOrder {
	id: number;
	performerId: number;
	orderId: number;
	start: string;
	end: string;
	status: EPerformerOrderStatus;
	performerRating: number;
	customerRating: number;
	performer: User;
	order: Order;
}