import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ERole } from '../interfaces/ERole.enum';

export class RegisterUserByManagerDto {
	@Expose()
	@IsString()
	@IsOptional()
	display_name!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	phone!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	role!: ERole;
}
