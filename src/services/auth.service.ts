import { SignInUserDto } from '../dto/signInUser.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { IUser } from '../interfaces/IUser.interface';
import { UserRepository } from '../repositories/user.repository';
import { RegisterUserByManagerDto } from '../dto/registerUserByManager.dto';
import { ERole } from '../interfaces/ERole.enum';

export class AuthService {
    private repository: UserRepository;

    constructor() {
        this.repository = new UserRepository();
    }

    getUserByToken = async (token: string): Promise<IUser | null> => {
        return await this.repository.getUserByToken(token);
    }

    getUserByPhone = async (phone: string, role: ERole): Promise<IUser | null> => {
        return await this.repository.getUserByPhone(phone, role);
    }

    signIn = async (userDto: SignInUserDto): Promise<IUser> => {
        return await this.repository.signInUser(userDto);
    }

    signUp = async (userDto: RegisterUserDto): Promise<IUser> => {
        return await this.repository.signUpUser(userDto);
    }

    addUser = async (userDto: RegisterUserByManagerDto): Promise<IUser> => {
        return await this.repository.addUser(userDto);
    }

    signOut = async (token: string): Promise<void> => {
        await this.repository.signOut(token);
    }
}
