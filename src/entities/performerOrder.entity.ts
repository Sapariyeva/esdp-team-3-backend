import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Order } from './order.entity';
import { User } from './user.entity';
import { EPerformerOrderStatus } from '../enum/EPerformerOrderStatus.enum';

@Entity()
@Index(['orderId', 'performerId'], { unique: true })
export class PerformerOrder {
	@PrimaryGeneratedColumn()
	id!: number;

	@Column()
	performerId!: number;

	@ManyToOne(() => User, user => user.performerOrders)
	@JoinColumn({ name: 'performerId' })
	performer!: User;

	@Column()
	orderId!: number;

	@ManyToOne(() => Order, order => order.performerOrders)
	@JoinColumn({ name: 'orderId' })
	order!: Order;

	@Column({ type: 'timestamp', nullable: true })
	start!: string;

	@Column({ type: 'timestamp', nullable: true })
	end!: string;

	@Column({
		type: 'enum',
		enum: EPerformerOrderStatus,
		default: EPerformerOrderStatus.WAITING,
	})
	status!: EPerformerOrderStatus;

	@Column({ nullable: true })
	performerRating!: number;

	@Column({ nullable: true })
	customerRating!: number;
}
