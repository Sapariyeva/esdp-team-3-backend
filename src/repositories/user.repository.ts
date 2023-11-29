import { IUser } from '../interfaces/IUser.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { appDataSource } from '../dataSource';
import { SignInUserDto } from '../dto/signInUser.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { RegisterUserByManagerDto } from '../dto/registerUserByManager.dto';
import { ERole } from '../interfaces/ERole.enum';
import bcrypt from 'bcrypt';

export class UserRepository extends Repository<User> {
    constructor() {
        super(User, appDataSource.createEntityManager());
    }

    async getUserById(id: number): Promise<IUser | null> {
        return await this.findOne({
            where: { id }
        })
    }

    async getUserByPhoneAndRole(phone: string, role: ERole): Promise<IUser | null> {
        return await this.findOne({
            where: { phone, role }
        })
    }

    async signInUser(userDto: SignInUserDto): Promise<IUser> {
        const { phone, password, role } = userDto;
        const user = await this.getUserByPhoneAndRole(phone, role);
        if (!user) {
            throw new Error('user not exist');
        } else {
            const valid = await this.comparePassword(password, user.password);
            if (valid) {
                return user;
            } else {
                throw new Error('wrong password');
            }
        }
    }

    async signUpUser(userDto: RegisterUserDto): Promise<IUser> {
        userDto.password = await this.hashPassword(userDto.password);
        return await this.save(userDto);
    }

    async addUser(userDto: RegisterUserByManagerDto): Promise<IUser> {
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
