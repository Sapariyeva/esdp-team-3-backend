import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class ArrivalNotificationDto {


    @Expose()
    @IsNotEmpty()
    @IsNumber()
    id!: number;
}