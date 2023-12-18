import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CompletionNotificationDto {
    @Expose()
    @IsNotEmpty()
    @IsNumber()
    id!: number;

}