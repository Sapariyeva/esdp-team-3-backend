import { IUser } from '../interfaces/IUser.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { appDataSource } from '../dataSource';
import { nanoid } from 'nanoid';
import { SignInUserDto } from '../dto/signInUser.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import bcrypt from 'bcrypt';
import { RegisterUserByManagerDto } from '../dto/registerUserByManager.dto';
import { ERole } from '../interfaces/ERole.enum';

export class UserRepository extends Repository<User> {
    constructor() {
        super(User, appDataSource.createEntityManager());
    }

    async getUserByToken(token: string): Promise<User | null> {
        return await this.findOne({
            where: { token }
        })
    }

    async getUserByPhone(phone: string, role: ERole): Promise<User | null> {
        return await this.findOne({
            where: { phone, role }
        })
    }

    async getUser(username: string): Promise<IUser | null> {
        return await this.findOne({
            where: { username }
        });
    }

    async signInUser(userDTO: SignInUserDto): Promise<IUser> {
        const { username, password } = userDTO;
        const user = await this.getUser(username);
        if (!user) {
            throw new Error('user not exist');
        } else {
            const valid = await this.comparePassword(password, user.password);
            if (valid) {
                const token = nanoid();
                await this.update(
                    { username },
                    { token })
                return {
                    ...user,
                    token,
                };
            } else {
                throw new Error('wrong password');
            }
        }
    }

    async signUpUser(userDto: RegisterUserDto): Promise<IUser> {
        userDto.password = await this.hashPassword(userDto.password);
        return await this.save({ ...userDto, token: nanoid() });
    }

    async addUser(userDto: RegisterUserByManagerDto): Promise<IUser> {
        return await this.save(userDto);
    }

    async signOut(token: string): Promise<void> {
        const user = await this.findOne({ where: { token } });
        if (user) {
            await this.update({ token }, { token: "" });
        } else {
            throw new Error('User already signed out');
        }
    }

    private hashPassword = async (password: string): Promise<string> => {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    }

    private comparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
        return await bcrypt.compare(password, hashedPassword);
    }
}
