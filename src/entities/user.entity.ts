import { Column, PrimaryGeneratedColumn, Entity, Unique } from 'typeorm';
import { IUser } from '../interfaces/IUser.interface';
import { ERole } from '../enum/ERole.enum';
import { EUserStatus } from '../enum/EUserStatus.enum';
import bcrypt from 'bcrypt'

@Entity()
@Unique(['phone', 'role'])
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    display_name!: string

    @Column()
    phone!: string

    @Column({ nullable: true })
    email!: string

    @Column({ nullable: true })
    password!: string

    @Column({ nullable: true })
    avatar!: string

    @Column({ nullable: true })
    birthday!: string

    @Column()
    role!: ERole

    @Column({ nullable: true })
    avg_rating!: number

    @Column({ nullable: true })
    rating_count!: number

    @Column({ nullable: true })
    last_postition!: string

    @Column({ nullable: true })
    identifying_number!: number

    @Column({ default: EUserStatus.ACTIVE })
    status!: EUserStatus

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }
}
