import { Expose } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from "class-validator";
import { EOrderStatus } from '../enum/EOrderStatus.enum';
import { IsUserExist } from '../decorators/IsUserExist.decorator';
import { ERole } from '../enum/ERole.enum';

export class getOrderParams {
    @Expose()
    @IsNumber()
    @IsOptional()
    @IsUserExist(ERole.customer, {
        message: "Customer doesn't exists. Choose another customer."
    })
    customer!: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    @IsUserExist(ERole.manager, {
        message: "Manager doesn't exists. Choose another manager."
    })
    manager!: number;

    @Expose()
    @IsNumber()
    @IsOptional()
    @IsUserExist(ERole.performer, {
        message: "Performer doesn't exists. Choose another performer."
    })
    performer!: number;

    @Expose()
    @IsString()
    @IsOptional()
    @IsEnum(EOrderStatus, { message: `Order status should be one of: ${Object.values(EOrderStatus).join(', ')}.` })
    status!: EOrderStatus;
}
