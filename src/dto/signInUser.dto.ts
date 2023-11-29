import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";
import { ERole } from '../interfaces/ERole.enum';

export class SignInUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9]+$/, { message: 'Phone number should contain only digits' })
  @MinLength(9, { message: 'Phone number should have at least 9 digits' })
  @MaxLength(9, { message: 'Phone number should have at most 9 digits' })
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
