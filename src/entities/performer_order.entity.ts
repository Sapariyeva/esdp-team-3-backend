import { Column, PrimaryGeneratedColumn, Entity, Unique, ManyToOne, JoinColumn } from 'typeorm';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { Performer } from './performer.entity';

@Entity()
@Unique(['identifying_number', 'user_id'])
export class PerformerOrder implements IPerformerOrder {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    performer_id!: number

    @ManyToOne(() => Performer)
    @JoinColumn({ name: 'performer_id' })
    artist!: Performer

    @Column()
    order_id!: number

    @Column()
    start!: string

    @Column()
    end!: string

    @Column()
    disable!: boolean

    @Column()
    performer_rating!: number

    @Column()
    customer_rating!: number
}
