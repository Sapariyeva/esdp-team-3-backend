import { Column, PrimaryGeneratedColumn, Entity, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { User } from './user.entity';

@Entity()
  @Unique([ 'id'])
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

    @Column({ nullable: true })
    start!: Date

    @Column({ nullable: true })
    end!: Date

    @Column({ default: false })
    disable!: boolean

    @Column({ nullable: true })
    performer_rating!: number

    @Column({ nullable: true })
    customer_rating!: number
}
