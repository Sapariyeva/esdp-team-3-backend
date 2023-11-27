import { Column, PrimaryGeneratedColumn, Entity, Unique } from 'typeorm';
import { IUser } from '../interfaces/IUser.interface';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt'
import { ERole } from '../interfaces/ERole.enum';

@Entity()
@Unique(['username'])
export class User implements IUser {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    display_name!: string

    @Column()
    phone!: string

    @Column({ nullable: true })
    username!: string

    @Column({ nullable: true })
    email!: string

    @Column({ nullable: true })
    password!: string

    @Column({ nullable: true })
    avatar!: string

    @Column({ type: "json" })
    roles!: ERole[]

    @Column({ nullable: true })
    token!: string

    @Column({ nullable: true })
    avg_rating!: number

    @Column({ nullable: true })
    rating_count!: number

    @Column({ nullable: true })
    last_postition!: string

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    generateToken(): void {
        this.token = nanoid();
    }

}
