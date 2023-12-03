import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ERole } from '../interfaces/ERole.enum';

export class UserWithRoleDto {
	@Expose()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[0-9]+$/, { message: 'Phone number should contain only digits' })
	@MinLength(10, { message: 'Phone number should have at least 10 digits' })
	@MaxLength(10, { message: 'Phone number should have at most 10 digits' })
	phone!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	password!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	role!: ERole;
}
