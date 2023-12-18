import { Expose } from "class-transformer";
import { IOrder } from "../interfaces/IOrder.interface";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class OrderDto implements IOrder {
	@Expose()
	id!: number

	@IsNotEmpty()
	@IsNumber()
	@Expose()
	customerId!: number

	@IsNotEmpty()
	@IsNumber()
	@Expose()
	serviceId!: number

	@IsNotEmpty()
	@IsString()
	@Expose()
	orderData!: string

	@IsNotEmpty()
	@IsString()
	@Expose()
	address!: string

	@IsNotEmpty()
	@IsNumber()
	@Expose()
	performersQuantity!: number

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
	managerId!: number

	@IsString()
	@Expose()
	displayName!: string

	@IsString()
	@Expose()
	phone!: string
}