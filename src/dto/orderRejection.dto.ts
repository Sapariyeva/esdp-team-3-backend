import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class OrderRejectionDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    id!: number;
}