import { Column, PrimaryGeneratedColumn, Entity, Unique, OneToMany } from 'typeorm';
import { IUser } from '../interfaces/IUser.interface';
import { ERole } from '../enum/ERole.enum';
import { EUserStatus } from '../enum/EUserStatus.enum';
import { PerformerOrder } from './performerOrder.entity';
import bcrypt from 'bcrypt'

@Entity()
@Unique(['phone', 'role'])
export class User implements IUser {
	@PrimaryGeneratedColumn()
	id!: number

	@Column()
	displayName!: string

	@Column()
	phone!: string

	@Column({ nullable: true })
	email!: string

	@Column({ nullable: true })
	password!: string

	@Column({ nullable: true })
	avatar!: string

	@Column({ type: "timestamp", nullable: true })
	birthday!: string

	@Column()
	role!: ERole

	@Column({ nullable: true })
	avgRating!: number

	@Column({ nullable: true })
	ratingCount!: number

	@Column({ nullable: true })
	lastPosition!: string

	@Column({ nullable: true })
	identifyingNumber!: string

	@Column({ default: EUserStatus.ACTIVE })
	status!: EUserStatus

	@OneToMany(() => PerformerOrder, performerOrder => performerOrder.performer)
	performerOrders!: PerformerOrder[];

	hashPassword(): void {
		const salt = bcrypt.genSaltSync(10);
		this.password = bcrypt.hashSync(this.password, salt);
	}
}
