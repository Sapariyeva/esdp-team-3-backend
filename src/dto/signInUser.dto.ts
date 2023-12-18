import { Expose } from 'class-transformer';
import { IsByteLength, IsNotEmpty, IsString, Matches } from "class-validator";

export class SignInUserDto {
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
}
