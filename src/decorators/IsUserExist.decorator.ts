import {
    registerDecorator,
    ValidationOptions,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
} from 'class-validator';
import { UserRepository } from '@/repositories/user.repository';
import { ERole } from '@/enum/ERole.enum';

@ValidatorConstraint({ async: true })
export class IsUserExistConstraint implements ValidatorConstraintInterface {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async validate(value: number, args: ValidationArguments) {
        const [role] = args.constraints;
        if (!value || !role) return false;
        const user = await this.userRepository.getUserByIdAndRole(value, role);
        return user !== null;
    }
}

export function IsUserExist(role: ERole, validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [role],
            async: true,
            validator: IsUserExistConstraint,
        });
    };
}