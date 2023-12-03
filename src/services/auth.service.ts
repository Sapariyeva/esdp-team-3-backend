import { SignInUserDto } from '../dto/signInUser.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { IUser, IUserWithoutPass } from '../interfaces/IUser.interface';
import { UserRepository } from '../repositories/user.repository';
import { ERole } from '../interfaces/ERole.enum';
import { nanoid } from 'nanoid';
import { redisClient } from './redis.service';
import { UserWithRoleDto } from '../dto/userWithRole.dto';
import { validate } from 'class-validator';

export class AuthService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    getUserByPhoneAndRole = async (phone: string, role: ERole): Promise<IUser | null> => {
        return await this.repository.getUserByPhoneAndRole(phone, role);
    }

    signInWithRole = async (userDto: UserWithRoleDto): Promise<IUserWithoutPass & { token: string }> => {
        const errors = await validate(userDto);
        if (errors.length) throw errors;
        const user = await this.repository.signInWithRole(userDto);
        const token = nanoid();
        await redisClient.set(token, user.id, { EX: 2 * 24 * 60 * 60 })
        return { ...user, token };
    }

    signIn = async (userDto: SignInUserDto): Promise<(IUserWithoutPass & { token: string })[] | IUserWithoutPass[]> => {
        const errors = await validate(userDto);
        if (errors.length) throw errors;
        const users = await this.repository.signInUser(userDto);
        if (users.length > 1) {
            return users;
        } else {
            const token = nanoid();
            await redisClient.set(token, users[0].id, { EX: 2 * 24 * 60 * 60 })
            return [{ ...users[0], token }];
        }
    }

    signUp = async (userDto: RegisterUserDto): Promise<IUser & { token: string }> => {
        const user = await this.repository.signUpUser(userDto);
        const token = nanoid();
        await redisClient.set(token, user.id, { EX: 2 * 24 * 60 * 60 })
        return { ...user, token };
    }

    addUser = async (userDto: UserWithRoleDto): Promise<IUser> => {
        const errors = await validate(userDto);
        if (errors.length) throw errors;
        return await this.repository.addUser(userDto);
    }

    signOut = async (token: string): Promise<number> => {
        return await redisClient.del(token);
    }
}
