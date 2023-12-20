import { SignInUserDto } from '../dto/signInUser.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { IUser, IUserWithTokens, IUserWithoutPass } from '../interfaces/IUser.interface';
import { UserRepository } from '../repositories/user.repository';
import { ERole } from '../enum/ERole.enum';
import { UserWithRoleDto } from '../dto/userWithRole.dto';
import { validate } from 'class-validator';
import { TokenService } from './token.service';
import { IGetUserParams } from '../interfaces/IGetParams';
import { IUserList } from '../interfaces/IList.interface';
import { RegisterUserByManager } from '../dto/registerUserByManager.dto';

export class AuthService {
    private repository: UserRepository;
    private tokenService: TokenService;

    constructor() {
        this.repository = new UserRepository();
        this.tokenService = new TokenService();
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

    signInWithRole = async (userDto: UserWithRoleDto): Promise<IUserWithTokens> => {
        const user = await this.repository.signInWithRole(userDto);
        const tokens = this.tokenService.generateTokens(user);
        await this.tokenService.saveTokens(user.id, tokens);
        return { ...user, ...tokens };
    }

    signIn = async (userDto: SignInUserDto): Promise<IUserWithoutPass[] | IUserWithTokens> => {
        const errors = await validate(userDto);
        if (errors.length) throw errors;
        const users = await this.repository.signInUser(userDto);
        if (users.length > 1) {
            return users;
        } else {
            const tokens = this.tokenService.generateTokens(users[0]);
            await this.tokenService.saveTokens(users[0].id, tokens);
            return { ...users[0], ...tokens };
        }
    }

    signUp = async (userDto: RegisterUserDto): Promise<IUserWithTokens> => {
        const user = await this.repository.signUpUser(userDto);
        const tokens = this.tokenService.generateTokens(user);
        await this.tokenService.saveTokens(user.id, tokens);
        return { ...user, ...tokens };
    }

    addUser = async (userDto: RegisterUserByManager): Promise<IUser> => {
        const errors = await validate(userDto);
        if (errors.length) throw errors;
        return await this.repository.addUser(userDto);
    }

    signOut = async (token: string): Promise<number> => {
        return await this.tokenService.removeToken(token);
    }

    refresh = async (refreshToken: string) => {
        if (!refreshToken) {
            throw new Error('Unauthorized');
        }
        const userData = this.tokenService.validateRefreshToken(refreshToken);
        const userId = await this.tokenService.findToken(refreshToken);
        if (!userData || !userId) {
            throw new Error('Unauthorized');
        }

        const user = await this.getUserById(parseInt(userId));
        let tokens;
        if (user) {
            tokens = this.tokenService.generateTokens(user);
            await this.tokenService.saveTokens(user.id, tokens);
        }
        return { ...user, ...tokens };
    }
}
