import { RequestHandler } from "express";
import { AuthService } from "../services/auth.service";
import { plainToInstance } from 'class-transformer';
import { SignInUserDto } from "../dto/signInUser.dto";
import { RegisterUserDto } from "../dto/registerUser.dto";
import { UserWithRoleDto } from "../dto/userWithRole.dto";
import { formatErrors } from "../helpers/formatErrors";
import { validate } from "class-validator";

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    signInWithRole: RequestHandler = async (req, res) => {
        try {
            const userDto = plainToInstance(UserWithRoleDto, req.body);
            const user = await this.service.signInWithRole(userDto);
            res.send({
                success: true,
                message: 'You logged in',
                payload: user
            })
        } catch (e: any) {
            res.status(401).send({
                success: false,
                message: e.message
            })
        }
    }

    signIn: RequestHandler = async (req, res) => {
        try {
            const userDto = plainToInstance(SignInUserDto, req.body);
            const users = await this.service.signIn(userDto);
            if (users.length > 1) {
                res.send({
                    success: true,
                    message: 'Choose your role',
                    payload: { ...users, password: undefined }
                })
            } else {
                res.send({
                    success: true,
                    message: 'You logged in',
                    payload: users[0]
                })
            }
        } catch (e: any) {
            res.status(401).send({
                success: false,
                message: e.message
            })
        }
    }

    signUp: RequestHandler = async (req, res) => {
        try {
            if (req.body.role === 'performer' && !req.body.birthday) {
                res.status(400).send({
                    success: false,
                    message: 'If the role \'performer\' is selected, the \'birthday\' field cannot be left empty.'
                });
            } else {
                const now = new Date();
                const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const dob = new Date(req.body.birthday);
                const dobnow = new Date(today.getFullYear(), dob.getMonth(), dob.getDate());
                let age = today.getFullYear() - dob.getFullYear();
                if (today < dobnow) {
                    age = age - 1;
                }
                if (age < 18) {
                    res.status(400).send({
                        success: false,
                        message: 'Performer must be at least 18 years old.'
                    });
                } else {
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
                }
            }
        } catch (e: any) {
            console.log(e);
            if ((e as { code: string }).code === 'ER_DUP_ENTRY') {
                res.send({
                    success: false,
                    message: 'User already exists',
                    errors: [
                        {
                            fields: ['phone', 'role'],
                            messages: ['phone with this role allready exist'],
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
