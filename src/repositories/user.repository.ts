import { IUser, IUserWithoutPass } from '../interfaces/IUser.interface';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { appDataSource } from '../dataSource';
import { SignInUserDto } from '../dto/signInUser.dto';
import { RegisterUserDto } from '../dto/registerUser.dto';
import { ERole } from '../enum/ERole.enum';
import { UserWithRoleDto } from '../dto/userWithRole.dto';
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

    async signInWithRole(userDto: UserWithRoleDto): Promise<IUserWithoutPass> {
        const { phone, password, role } = userDto;
        const user = await this.getUserByPhoneAndRole(phone, role);
        if (!user) {
            throw new Error('user not exist');
        } else {
            const valid = await this.comparePassword(password, user.password);
            if (valid) {
                const { password: _, ...userWithoutPass } = user;
                return userWithoutPass as IUserWithoutPass;
            } else {
                throw new Error('wrong password');
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
                const { password: _, ...userWithoutPass } = user;
                validUsers.push(userWithoutPass as IUserWithoutPass);
            }
        }

        if (validUsers.length === 0) {
            throw new Error('Wrong password');
        } else {
            return validUsers;
        }
    }

    async signUpUser(userDto: RegisterUserDto): Promise<IUser> {
        userDto.password = await this.hashPassword(userDto.password);
        return await this.save(userDto);
    }

    async addUser(userDto: UserWithRoleDto): Promise<IUser> {
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
