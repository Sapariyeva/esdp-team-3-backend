import { Column, PrimaryGeneratedColumn, Entity, Unique } from 'typeorm';
import { IService } from '@/interfaces/IService.interface';

@Entity()
@Unique(['name'])
export class Service implements IService {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    price!: number
}
