import { Expose } from 'class-transformer';
import { IsByteLength, IsEnum, IsNotEmpty, IsString, Matches } from "class-validator";
import { ERole } from '../enum/ERole.enum';

export class UserWithRoleDto {
	@Expose()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[0-9]+$/, { message: 'Phone number should contain only digits' })
	@IsByteLength(10, 10)
	phone!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	password!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	@IsEnum(ERole, { message: `User role should be one of: ${Object.values(ERole).join(', ')}.` })
	role!: ERole;
}
