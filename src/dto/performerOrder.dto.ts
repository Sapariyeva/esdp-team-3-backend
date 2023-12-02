import { Expose } from "class-transformer";
import { IsNotEmpty, IsNumber } from "class-validator";
import { EPerformerOrderStatus } from "../interfaces/EPerformerOrderStatus.enum";

export class PerformerOrderDto {
  @Expose()
  @IsNotEmpty()
  @IsNumber()
  order_id!: number;

  @Expose()
  @IsNotEmpty()
  @IsNumber()
  performer_id!: number;

  @Expose()
  status!: EPerformerOrderStatus;
}