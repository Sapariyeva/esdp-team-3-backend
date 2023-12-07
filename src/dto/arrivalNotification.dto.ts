import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ArrivalNotificationDto {
	@Expose()
	@IsNotEmpty()
	@IsNumber()
	orderId!: number;

	@Expose()
	@IsNotEmpty()
	@IsNumber()
	performerId!: number;
}