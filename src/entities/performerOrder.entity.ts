import { Column, PrimaryGeneratedColumn, Entity, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { User } from './user.entity';
import { EPerformerOrderStatus } from '../enum/EPerformerOrderStatus.enum';
import { Order } from './order.entity';

@Entity()
@Unique(['orderId', 'performerId'])
export class PerformerOrder implements IPerformerOrder {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	performerId!: number

	@ManyToOne(() => User)
	@JoinColumn({ name: 'performerId' })
	performer!: User

	@Column()
	orderId!: number

	@ManyToOne(() => Order)
	@JoinColumn({ name: 'orderId' })
	order!: Order

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	start!: string

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	end!: string

	@Column({
		type: "enum",
		enum: EPerformerOrderStatus,
		default: EPerformerOrderStatus.WAITING
	})
	status!: EPerformerOrderStatus;

	@Column({ nullable: true })
	performerRating!: number

	@Column({ nullable: true })
	customerRating!: number
}
