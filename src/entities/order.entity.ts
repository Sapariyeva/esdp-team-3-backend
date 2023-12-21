import { Column, PrimaryGeneratedColumn, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { IOrder } from '../interfaces/IOrder.interface';
import { Service } from './service.entity';
import { User } from './user.entity';
import { EOrderStatus } from '../enum/EOrderStatus.enum';
import { PerformerOrder } from './performerOrder.entity';

@Entity()
export class Order implements IOrder {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	customerId!: number

	@ManyToOne(() => User)
	@JoinColumn({ name: 'customerId' })
	customer!: User

	@Column()
	serviceId!: number

	@ManyToOne(() => Service)
	@JoinColumn({ name: 'serviceId' })
	service!: Service

	@Column({ type: "timestamp", default: () => "CURRENT_TIMESTAMP" })
	createdAt!: string

	@Column({ type: "timestamp" })
	orderData!: string

	@Column()
	address!: string

	@Column({ nullable: true })
	description!: string

	@Column()
	performersQuantity!: number

	@OneToMany(() => PerformerOrder, performerOrder => performerOrder.order)
	performerOrders!: PerformerOrder[];

	@Column({ nullable: true })
	timeWorked!: number

	@Column({ nullable: true })
	income!: number

	@Column({ nullable: true })
	performerPayment!: number

	@Column({ nullable: true })
	tax!: number

	@Column({ nullable: true })
	profit!: number

	@Column({ nullable: true })
	lat!: number

	@Column({ nullable: true })
	lng!: number

	@Column({ nullable: true })
	managerId!: number

	@ManyToOne(() => User)
	@JoinColumn({ name: 'managerId' })
	manager!: User

	@Column({ nullable: true })
	managerCommentary!: string

	@Column()
	status!: EOrderStatus
}
