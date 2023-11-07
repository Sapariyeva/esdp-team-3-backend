import { RequestHandler } from "express";
import { AuthService } from "../services/auth.service";
import { plainToInstance } from 'class-transformer';
import { SignInUserDto } from "../dto/signInUser.dto";
import { RegisterUserDto } from "../dto/registerUser.dto";
import { validate } from "class-validator";
import { formatErrors } from "../helpers/formatErrors";

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    signIn: RequestHandler = async (req, res) => {
        try {
            const userDto = plainToInstance(SignInUserDto, req.body);
            const user = await this.service.signIn(userDto);
            res.send({
                success: true,
                message: 'You logged in',
                payload: { ...user, password: undefined },
            })
        } catch (e: any) {
            res.status(401).send({
                success: false,
                message: e.message
            })
        }
    }

    signUp: RequestHandler = async (req, res) => {
        try {
            const registerUserDto = plainToInstance(RegisterUserDto, req.body);
            const errors = await validate(registerUserDto, {
                whitelist: true,
                validationError: {
                    target: false,
                    value: false
                }
            })
            if (errors.length > 0) {
                res.status(400).send({
                    success: false,
                    message: 'Validation failed',
                    errors: formatErrors(errors)
                });
                return;
            }
            const user = await this.service.signUp(registerUserDto);
            res.send({
                success: true,
                payload: { ...user, password: undefined }
            })
        } catch (e: any) {
            console.log(e);
            if ((e as { code: string }).code === 'ER_DUP_ENTRY') {
                res.send({
                    success: false,
                    message: 'User already exists',
                    errors: [
                        {
                            field: 'username',
                            messages: ['Username exist'],
                        },
                    ],
                });
            } else {
                res.status(500).send({
                    success: false,
                    message: 'Internal server error',
                });
            }
        }
    }

    signOut: RequestHandler = async (req, res) => {
        try {
            let token = req.headers['authorization']
            if (req.headers && token) {
                if (token.startsWith('Bearer ')) token = token.slice(7);
                await this.service.signOut(token);
                res.status(200).send({
                    success: true,
                    message: 'You logged out'
                })
            } else {
                res.status(400).send({
                    success: false,
                    message: 'No token provided'
                })
            }
        } catch (e: any) {
            console.log(e);
            res.status(500).send({
                success: false,
                message: e.message,
            })
        }
    }
}
