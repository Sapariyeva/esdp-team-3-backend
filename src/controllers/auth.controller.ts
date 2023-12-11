import { RequestHandler } from "express";
import { AuthService } from "../services/auth.service";
import { plainToInstance } from 'class-transformer';
import { SignInUserDto } from "../dto/signInUser.dto";
import { RegisterUserDto } from "../dto/registerUser.dto";
import { UserWithRoleDto } from "../dto/userWithRole.dto";
import { formatErrors } from "../helpers/formatErrors";
import { validate } from "class-validator";
import { getUserParams } from "../dto/getUserParams.dto";
import dotenv from "dotenv";
import * as process from "process";

dotenv.config();

export class AuthController {
    private service: AuthService;

    constructor() {
        this.service = new AuthService();
    }

    getUser: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const user = await this.service.getUserById(parseInt(req.params.id));
            if (user) {
                res.send(user);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'user not found'
                });
            }
        } catch (e: any) {
            console.log(e)
            if (Array.isArray(e)) {
                res.status(401).send({
                    success: false,
                    message: e
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: e.message
                })
            }
        }
    }

    getUsers: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            const paramsDto = plainToInstance(getUserParams, req.query);
            const errors = await validate(paramsDto);
            if (errors.length) throw errors;
            const result = await this.service.getUsers({ ...paramsDto, offset, limit });
            if (result.users.length !== 0) {
                res.send(result);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Users not found'
                });
            }
        } catch (e: any) {
            console.log(e)
            if (Array.isArray(e)) {
                res.status(401).send({
                    success: false,
                    message: e
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: e.message
                })
            }
        }
    }

    signInWithRole: RequestHandler = async (req, res) => {
        try {
            const userDto = plainToInstance(UserWithRoleDto, req.body);
            const errors = await validate(userDto);
            if (errors.length) throw errors;
            const user = await this.service.signInWithRole(userDto);
            res.cookie('refreshToken', user.refreshToken, { maxAge: parseInt(process.env.JWT_REFRESH_TIME!) * 1000, httpOnly: true })
            console.log(res.cookie);
            res.send({
                success: true,
                message: 'You logged in',
                payload: user
            })
        } catch (e: any) {
            console.log(e)
            if (Array.isArray(e)) {
                res.status(401).send({
                    success: false,
                    message: e
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: e.message
                })
            }
        }
    }

    signIn: RequestHandler = async (req, res) => {
        try {
            const userDto = plainToInstance(SignInUserDto, req.body);
            const result = await this.service.signIn(userDto);
            if (Array.isArray(result)) {
                res.send({
                    success: true,
                    message: 'Choose your role',
                    payload: { ...result, password: undefined }
                })
            } else {
                res.cookie('refreshToken', result.refreshToken, { maxAge: parseInt(process.env.JWT_REFRESH_TIME!) * 1000, httpOnly: true })
                res.send({
                    success: true,
                    message: 'You logged in',
                    payload: result
                })
            }
        } catch (e: any) {
            if (Array.isArray(e)) {
                res.status(401).send({
                    success: false,
                    message: e
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: e.message
                })
            }
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
                    res.cookie('refreshToken', user.refreshToken, { maxAge: parseInt(process.env.JWT_REFRESH_TIME!) * 1000, httpOnly: true })
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
            const { refreshToken } = req.cookies;
            if (refreshToken) {
                await this.service.signOut(refreshToken);
                res.clearCookie('refreshToken');
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

    refresh: RequestHandler = async (req, res) => {
        try {
            const { refreshToken } = req.cookies;
            const user = await this.service.refresh(refreshToken);
            res.cookie('refreshToken', user.refreshToken, { maxAge: parseInt(process.env.JWT_REFRESH_TIME!) * 1000, httpOnly: true })
            res.send({
                success: true,
                message: 'Tokens refreshed',
                payload: user
            })
        } catch (e: any) {
            console.log(e)
            if (Array.isArray(e)) {
                res.status(401).send({
                    success: false,
                    message: e
                })
            } else {
                res.status(401).send({
                    success: false,
                    message: e.message
                })
            }
        }
    }

}
