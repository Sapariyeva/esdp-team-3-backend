import { SignInUserDto } from '../dto/signInUser.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { IUser } from '../interfaces/IUser.interface';
import { UserRepository } from '../repositories/user.repository';
import { RegisterUserByManagerDto } from '../dto/registerUserByManager.dto';
import { ERole } from '../interfaces/ERole.enum';
import { nanoid } from 'nanoid';
import { redisClient } from './redis.service';

export class AuthService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    getUserByPhoneAndRole = async (phone: string, role: ERole): Promise<IUser | null> => {
        return await this.repository.getUserByPhoneAndRole(phone, role);
    }

    signIn = async (userDto: SignInUserDto): Promise<IUser & { token: string }> => {
        const user = await this.repository.signInUser(userDto);
        const token = nanoid();
        await redisClient.set(token, user.id, { EX: 2 * 24 * 60 * 60 })
        return { ...user, token };
    }

    signUp = async (userDto: RegisterUserDto): Promise<IUser & { token: string }> => {
        const user = await this.repository.signUpUser(userDto);
        const token = nanoid();
        await redisClient.set(token, user.id, { EX: 2 * 24 * 60 * 60 })
        return { ...user, token };
    }

    addUser = async (userDto: RegisterUserByManagerDto): Promise<IUser> => {
        return await this.repository.addUser(userDto);
    }

    signOut = async (token: string): Promise<number> => {
        return await redisClient.del(token);
    }
}
