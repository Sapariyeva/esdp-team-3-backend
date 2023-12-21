import { IUser, IUserWithoutPass } from '../interfaces/IUser.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { appDataSource } from '../dataSource';
import { SignInUserDto } from '../dto/signInUser.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { ERole } from '../enum/ERole.enum';
import { UserWithRoleDto } from '../dto/userWithRole.dto';
import { IGetUserParams } from '../interfaces/IGetParams';
import { IUserList } from '../interfaces/IList.interface';
import { getLinks } from '../helpers/getLinks';
import { EUserStatus } from '../enum/EUserStatus.enum';
import { RegisterUserByManager } from '../dto/registerUserByManager.dto';
import bcrypt from 'bcrypt';

export class UserRepository extends Repository<User> {
    constructor() {
        super(User, appDataSource.createEntityManager());
    }

    async getUserById(id: number): Promise<IUserWithoutPass | null> {
        const user = await this.findOne({
            where: { id }
        })
        if (user) {
            const { password, ...userWithoutPass } = user;
            return userWithoutPass;
        }
        return user
    }

    async getUserByIdAndRole(id: number, role: ERole): Promise<IUser | null> {
        return await this.findOne({
            where: { id, role }
        })
    }

    async getUserByPhoneAndRole(phone: string, role: ERole): Promise<IUser | null> {
        return await this.findOne({
            where: { phone, role }
        })
    }

    async getUsers(params: IGetUserParams): Promise<IUserList> {
        const { offset, limit, phone, email, role, status } = params;

        const queryBuilder = this.createQueryBuilder("user");

        if (phone) {
            queryBuilder.andWhere("user.phone = :phone", { phone });
        }

        if (email) {
            queryBuilder.andWhere("user.email = :email", { email });
        }

        if (role) {
            queryBuilder.andWhere("user.role = :role", { role });
        }

        if (status) {
            queryBuilder.andWhere("user.status = :status", { status });
        }

        const totalItems = await queryBuilder.getCount();
        const users = await queryBuilder.skip(offset).take(limit).getMany();
        const links = getLinks({ totalItems, ...params }, 'user');

        return { users, totalItems, totalPages: Math.ceil(totalItems / limit), links };
    }

    async getUserCSV(): Promise<IUserWithoutPass[]> {
        const users = await this.createQueryBuilder('user')
            .select([
                'user.id',
                'user.phone',
                'user.displayName',
                'user.email',
                'user.birthday',
                'user.role',
                'user.avgRating',
                'user.ratingCount',
                'user.lastPosition',
                'user.identifyingNumber',
                'user.status'
            ])
            .getMany();
        return users;
    }

    async signInWithRole(userDto: UserWithRoleDto): Promise<IUserWithoutPass> {
        const { phone, password, role } = userDto;
        const user = await this.getUserByPhoneAndRole(phone, role);
        if (!user) {
            throw new Error('User does not exist');
        } else {
            const valid = await this.comparePassword(password, user.password);
            if (valid) {
                const { password, ...userWithoutPass } = user;
                return userWithoutPass as IUserWithoutPass;
            } else {
                throw new Error('Wrong password');
            }
        }
    }

    async signInUser(userDto: SignInUserDto): Promise<IUserWithoutPass[]> {
        const { phone, password } = userDto;
        const users = await this.find({ where: { phone } });

        if (users.length === 0) {
            throw new Error('User does not exist');
        }

        const validUsers: IUserWithoutPass[] = [];

        for (const user of users) {
            const isPasswordValid = await this.comparePassword(password, user.password);
            if (isPasswordValid) {
                const { password, ...userWithoutPass } = user;
                validUsers.push(userWithoutPass as IUserWithoutPass);
            }
        }

        if (validUsers.length === 0) {
            throw new Error('Wrong password');
        } else {
            return validUsers;
        }
    }

    async signUpUser(userDto: RegisterUserDto): Promise<IUserWithoutPass> {
        userDto.password = await this.hashPassword(userDto.password);
        const anotherRoleUser = await this.findOne({ where: { phone: userDto.phone } });
        // Если пользователь уже зарегистрирован в системе под другой ролью, то имя берется от этой роли
        if (anotherRoleUser) userDto.displayName = anotherRoleUser.displayName;
        let status = EUserStatus.ACTIVE;
        // Исполнителя нужно проверить на возраст, поэтому статус будет в ожидании
        if (userDto.role === ERole.performer) status = EUserStatus.AWAITING;
        const { password, ...user } = await this.save({ ...userDto, status });
        return user;
    }

    async addUser(userDto: RegisterUserByManager): Promise<IUser> {
        return await this.save(userDto);
    }

    private hashPassword = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    private comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
        return await bcrypt.compare(password, hashedPassword);
    }
}
