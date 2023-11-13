import { Column, PrimaryGeneratedColumn, Entity, Unique } from 'typeorm';
import { ICustomer } from '../interfaces/ICustomer.interface';
import { EOrganizationType } from '../interfaces/EOrganizationType.enum';

@Entity()
@Unique(['identifying_number', 'user_id'])
export class Customer implements ICustomer {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    identifying_number!: number

    @Column()
    organization_type!: EOrganizationType

    @Column()
    name!: string

    @Column()
    user_id!: number
}
