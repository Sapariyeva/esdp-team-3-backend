import { SignInUserDto } from '@/dto/signInUser.dto';
import { RegisterUserDto } from '@/dto/registerUser.dto';
import { IUserWithTokens, IUserWithoutPass } from '@/interfaces/IUser.interface';
import { UserRepository } from '@/repositories/user.repository';
import { UserWithRoleDto } from '@/dto/userWithRole.dto';
import { validate } from 'class-validator';
import { TokenService } from '@/services/token.service';
import { UserService } from './user.service';

export class AuthService {
    private repository: UserRepository;
    private tokenService: TokenService;
    private userService: UserService;

    constructor() {
        this.repository = new UserRepository();
        this.tokenService = new TokenService();
        this.userService = new UserService();
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

        const user = await this.userService.getUserById(parseInt(userId));
        let tokens;
        if (user) {
            tokens = this.tokenService.generateTokens(user);
            await this.tokenService.saveTokens(user.id, tokens);
        }
        return { ...user, ...tokens };
    }
}
