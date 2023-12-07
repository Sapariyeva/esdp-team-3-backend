import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { ERole } from '../enum/ERole.enum';

export class RegisterUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  displayName!: string;

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


  @Expose()
  @IsString()
  @IsOptional()
  birthday!: string;

  @Expose()
  @IsString()
  @IsOptional()
  @Matches(/^[0-9]+$/, { message: 'BIN/IIN field should contain only digits' })
  @MinLength(12, { message: 'BIN/IIN field should have at least 12 digits' })
  @MaxLength(12, { message: 'BIN/IIN field should have at most 12 digits' })
  identifyingNumber!: string;
}
