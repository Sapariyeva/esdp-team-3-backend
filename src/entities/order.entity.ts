import { Column, PrimaryGeneratedColumn, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { IOrder } from '../interfaces/IOrder.inteface';
import { EOrderStatus } from '../interfaces/EOrderStatus.enum';
import { Customer } from './customer.entity';
import { Service } from './service.entity';

@Entity()
export class Order implements IOrder {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    customer_id!: number

    @ManyToOne(() => Customer)
    @JoinColumn({ name: 'customer_id' })
    artist!: Customer

    @Column()
    service_id!: number

    @ManyToOne(() => Service)
    @JoinColumn({ name: 'service_id' })
    service!: Service

    @Column()
    created_at!: string

    @Column()
    order_data!: string

    @Column()
    address!: string

    @Column()
    performers_quantity!: number

    @Column()
    time_worked!: number

    @Column()
    income!: number

    @Column()
    performer_payment!: number

    @Column()
    tax!: number

    @Column()
    profit!: number

    @Column()
    lat!: number

    @Column()
    lng!: number

    @Column()
    status!: EOrderStatus
}
