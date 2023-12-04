import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class CompletionNotificationDto {
	@Expose()
	@IsNotEmpty()
	@IsNumber()
	order_id!: number;

	@Expose()
	@IsNotEmpty()
	@IsNumber()
	performer_id!: number;

	@Expose()
	@IsNotEmpty()
	@IsDate()
	end!: string;
}