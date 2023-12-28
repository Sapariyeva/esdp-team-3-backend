import { Expose } from 'class-transformer';
import { IsByteLength, IsEnum, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';
import { ERole } from '@/enum/ERole.enum';

export class RegisterUserDto {
	@Expose()
	@IsString()
	@IsNotEmpty()
	displayName!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	@Matches(/^[0-9]+$/, { message: 'Phone number should contain only digits' })
	@IsByteLength(10, 10)
	phone!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	@IsByteLength(6, 32)
	password!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	@IsEnum(ERole, { message: `User role should be one of: ${Object.values(ERole).join(', ')}.` })
	role!: ERole;

	@Expose()
	@IsString()
	@IsOptional()
	birthday!: string;

	@Expose()
	@IsString()
	@IsOptional()
	@Matches(/^[0-9]+$/, { message: 'BIN/IIN field should contain only digits' })
	@IsByteLength(12, 12)
	identifyingNumber!: string;
}
