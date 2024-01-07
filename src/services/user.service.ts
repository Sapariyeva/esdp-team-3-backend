import { IUser, IUserWithoutPass } from '@/interfaces/IUser.interface';
import { UserRepository } from '@/repositories/user.repository';
import { ERole } from '@/enum/ERole.enum';
import { validate } from 'class-validator';
import { IGetUserParams } from '@/interfaces/IGetParams';
import { IUserList } from '@/interfaces/IList.interface';
import { RegisterUserByManager } from '@/dto/registerUserByManager.dto';

export class UserService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    getUserById = async (id: number): Promise<IUserWithoutPass | null> => {
        return await this.repository.getUserById(id);
    }

    getUsers = async (params: IGetUserParams): Promise<IUserList> => {
        return await this.repository.getUsers(params);
    }

    getUserByIdAndRole = async (id: number, role: ERole): Promise<IUser | null> => {
        return await this.repository.getUserByIdAndRole(id, role);
    }

    getUserByPhoneAndRole = async (phone: string, role: ERole): Promise<IUser | null> => {
        return await this.repository.getUserByPhoneAndRole(phone, role);
    }

    addUser = async (userDto: RegisterUserByManager): Promise<IUser> => {
        const errors = await validate(userDto);
        if (errors.length) throw errors;
        return await this.repository.addUser(userDto);
    }
}
