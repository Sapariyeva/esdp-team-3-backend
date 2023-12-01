import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsDate } from 'class-validator';

export class ArrivalNotificationDto {
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
  start!: Date;
}