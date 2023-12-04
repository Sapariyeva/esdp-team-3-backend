import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ERole } from '../enum/ERole.enum';

export class RegisterUserDto {
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
	password!: string;

	@Expose()
	@IsString()
	@IsNotEmpty()
	role!: ERole;
}
