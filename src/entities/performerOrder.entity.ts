import { Column, PrimaryGeneratedColumn, Entity, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { User } from './user.entity';
import { EPerformerOrderStatus } from '../interfaces/EPerformerOrderStatus.enum';
import { Order } from './order.entity';

@Entity()
@Unique(['order_id', 'performer_id'])
export class PerformerOrder implements IPerformerOrder {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	performer_id!: number

	@ManyToOne(() => User)
	@JoinColumn({ name: 'performer_id' })
	performer!: User

	@Column()
	order_id!: number

	@ManyToOne(() => Order)
	@JoinColumn({ name: 'order_id' })
	order!: Order

	@Column({ nullable: true })
	start!: Date

	@Column({ nullable: true })
	end!: Date

	@Column({
		type: "enum",
		enum: EPerformerOrderStatus,
		default: EPerformerOrderStatus.WAITING
	})
	status!: EPerformerOrderStatus;

	@Column({ nullable: true })
	performer_rating!: number

	@Column({ nullable: true })
	customer_rating!: number
}
