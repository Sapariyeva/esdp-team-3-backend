import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CompletionNotificationDto {
	@Expose()
	@IsNotEmpty()
	@IsNumber()
	orderId!: number;

	@Expose()
	@IsNotEmpty()
	@IsNumber()
	performerId!: number;

	@Expose()
	@IsNotEmpty()
	@IsDate()
	end!: string;
}