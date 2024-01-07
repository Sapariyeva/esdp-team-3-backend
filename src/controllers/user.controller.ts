import { RequestHandler } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { UserService } from '@/services/user.service';
import { formatErrors } from '@/helpers/formatErrors';
import { UserRepository } from '@/repositories/user.repository';
import { getUserParams } from '@/dto/getUserParams.dto';
import { getCurrentDate } from '@/helpers/getCurrentDate';
import dotenv from 'dotenv';
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import path from 'path';
import { RegisterUserByManager } from '@/dto/registerUserByManager.dto';

dotenv.config();

export class UserController {
    private service: UserService;

    constructor() {
        this.service = new UserService();
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
                res.send({
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

    getUserCSV: RequestHandler = async (req, res): Promise<void> => {
        try {
            const userRepository = new UserRepository();
            const users = await userRepository.getUserCSV();

            const formattedDateTime = getCurrentDate();

            const csvFileName = `users_${formattedDateTime}.csv`;
            const csvFilePath = path.join(__dirname, '../..', 'csv', csvFileName);

            const ws = fs.createWriteStream(csvFilePath);
            const csvStream = fastcsv.format({ headers: true });
            csvStream.pipe(ws);

            users.forEach(user => {
                csvStream.write({
                    'ID': user.id,
                    'Телефон': user.phone,
                    'Имя': user.displayName,
                    'Email': user.email,
                    'День рождения': user.birthday,
                    'Роль': user.role,
                    'Средний рейтинг': user.avgRating,
                    'Кол-во отзывов': user.ratingCount,
                    'Последнее местоположение': user.lastPosition,
                    'БИН/ИИН': user.identifyingNumber,
                    'Статус': user.status
                });
            });

            csvStream.end();
            ws.on('finish', () => {
                console.log('CSV файл успешно создан.');
                res.download(csvFilePath, csvFileName, (err) => {
                    if (err) {
                        console.error(err);
                        res.status(500).json({ error: 'Internal Server Error' });
                    } else {
                        fs.unlinkSync(csvFilePath);
                    }
                });
            });

            ws.on('error', (error) => {
                console.error(error);
            });

        } catch (e: any) {
            console.log(e);
            if (e.message) {
                res.status(400).send({
                    success: false,
                    message: e.message
                });
            } else if (Array.isArray(e)) {
                res.status(400).send(e);
            } else {
                res.status(500).send(e);
            }
        }
    }

    addUser: RequestHandler = async (req, res) => {
        try {
            const registerUserDto = plainToInstance(RegisterUserByManager, req.body);
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
            const user = await this.service.addUser(registerUserDto);
            res.send({
                success: true,
                payload: { ...user, password: undefined }
            })
        } catch (e: any) {
            console.log(e);
            if ((e as { code: string }).code === 'ER_DUP_ENTRY') {
                res.status(400).send({
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

}
