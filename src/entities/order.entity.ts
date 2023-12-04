import { Column, PrimaryGeneratedColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IOrder } from '../interfaces/IOrder.interface';
import { EOrderStatus } from '../interfaces/EOrderStatus.enum';
import { Service } from './service.entity';
import { User } from './user.entity';

@Entity()
export class Order implements IOrder {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	customer_id!: number

	@ManyToOne(() => User)
	@JoinColumn({ name: 'customer_id' })
	customer!: User

	@Column()
	service_id!: number

	@ManyToOne(() => Service)
	@JoinColumn({ name: 'service_id' })
	service!: Service

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	created_at!: string

	@Column()
	order_data!: string

	@Column()
	address!: string

	@Column({ nullable: true })
	description!: string

	@Column()
	performers_quantity!: number

	@Column({ nullable: true })
	time_worked!: number

	@Column({ nullable: true })
	income!: number

	@Column({ nullable: true })
	performer_payment!: number

	@Column({ nullable: true })
	tax!: number

	@Column({ nullable: true })
	profit!: number

	@Column()
	lat!: number

	@Column()
	lng!: number

	@Column({ nullable: true })
	manager_id!: number

	@Column({ nullable: true })
	manager_commentary!: string

	@Column()
	status!: EOrderStatus
}
