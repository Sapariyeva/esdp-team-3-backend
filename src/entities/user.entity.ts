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
    displayName!: string

    @Column()
    username!: string

    @Column()
    password!: string

    @Column({ default: ERole.user })
    role!: ERole

    @Column({ nullable: true })
    token!: string

    hashPassword(): void {
        const salt = bcrypt.genSaltSync(10);
        this.password = bcrypt.hashSync(this.password, salt);
    }

    generateToken(): void {
        this.token = nanoid();
    }

}
