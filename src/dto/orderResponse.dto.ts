import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderResponseDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  order_id!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  performer_id!: number;
}