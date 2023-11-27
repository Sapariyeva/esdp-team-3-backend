import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ERole } from '../interfaces/ERole.enum';

export class RegisterUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Expose()
  @IsString()
  @IsOptional()
  display_name!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  email!: string;

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
  roles!: ERole[];
}
