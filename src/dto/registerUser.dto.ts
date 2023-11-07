import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class RegisterUserDto {
  @Expose()
  @IsString()
  @IsNotEmpty()
  username!: string;

  @Expose()
  @IsString()
  @IsOptional()
  displayName!: string;

  @Expose()
  @IsString()
  @IsNotEmpty()
  password!: string;
}
