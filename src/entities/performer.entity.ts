import { Column, PrimaryGeneratedColumn, Entity, Unique } from 'typeorm';
import { IPerformer } from '../interfaces/IPerformer.interface';

@Entity()
@Unique(['identifying_number', 'user_id'])
export class Performer implements IPerformer {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    identifying_number!: number

    @Column()
    name!: string

    @Column()
    user_id!: number
}
