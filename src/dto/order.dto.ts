import { Expose } from "class-transformer";
import { IOrder } from "../interfaces/IOrder.interface";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class OrderDto implements IOrder {
    @Expose()
    id!: number

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    customer_id!: number

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    service_id!: number

    @IsNotEmpty()
    @IsString()
    @Expose()
    order_data!: string

    @IsNotEmpty()
    @IsString()
    @Expose()
    address!: string

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    performers_quantity!: number

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    lat!: number

    @IsNotEmpty()
    @IsNumber()
    @Expose()
    lng!: number

    @IsNumber()
    @Expose()
    manager_id!: number

    @IsString()
    @Expose()
    display_name!: string

    @IsString()
    @Expose()
    phone!: string
}