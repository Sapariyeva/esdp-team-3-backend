import { RequestHandler } from "express";
import { OrderService } from "../services/order.service";
import { OrderDto } from "../dto/order.dto";
import { plainToInstance } from "class-transformer";
import { ERole } from "../enum/ERole.enum";
import { AuthService } from "../services/auth.service";
import { getOrderParams } from "../dto/getOrderParams.dto";
import { validate } from "class-validator";
import { EOrderStatus } from "../enum/EOrderStatus.enum";
import { OrderRepository } from "../repositories/order.repository";
import { getCurrentDate } from "../helpers/getCurrentDate";
import { RegisterUserByManager } from "../dto/registerUserByManager.dto";
import * as fs from 'fs';
import * as fastcsv from 'fast-csv';
import path from 'path';

export class OrderController {
    private service: OrderService;
    private authService: AuthService;

    constructor() {
        this.service = new OrderService();
        this.authService = new AuthService();
    }

    getOrder: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const order = await this.service.getOrderById(parseInt(req.params.id));
            if (order) {
                res.send(order);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'order not found'
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

    getOrders: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const { service, manager, customer, performer, status, sortBy } = req.query;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            const sortOrder = req.query.sortOrder ? req.query.sortOrder as "ASC" | "DESC" : "ASC";
            const plainData = {
                service: service ? parseInt(service as string) : null,
                manager: manager ? parseInt(manager as string) : null,
                customer: customer ? parseInt(customer as string) : null,
                performer: performer ? parseInt(performer as string) : null,
                status: status ? status as EOrderStatus : null,
                sortBy
            };
            const paramsDto = plainToInstance(getOrderParams, plainData);
            const errors = await validate(paramsDto);
            if (errors.length) throw errors;
            const result = await this.service.getOrders({ ...paramsDto, offset, limit, sortOrder });

            if (result.orders.length !== 0) {
                res.send(result);
            } else {
                res.send({
                    success: false,
                    message: 'Orders not found'
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

    getOrderCSV: RequestHandler = async (req, res): Promise<void> => {
        try {
            const orderRepository = new OrderRepository();
            const orders = await orderRepository.getOrdersCSV();

            const formattedDateTime = getCurrentDate();

            const csvFileName = `orders_${formattedDateTime}.csv`;
            const csvFilePath = path.join(__dirname, '../..', 'csv', csvFileName);

            const ws = fs.createWriteStream(csvFilePath);
            const csvStream = fastcsv.format({ headers: true });
            csvStream.pipe(ws);

            orders.forEach(order => {
                csvStream.write({
                    'ID': order.id,
                    'Дата создания': getCurrentDate(order.createdAt),
                    'Заказчик': order.customer.displayName,
                    'Телефон заказчика': `8${order.customer.phone}`,
                    'Услуга': order.service.name,
                    'Дата исполнения': getCurrentDate(order.orderData),
                    'Адрес': order.address,
                    'Описание': order.description,
                    'Кол-во грузчиков': order.performersQuantity,
                    'Откликнувшиеся грузчики': !order.performerOrders ? '' : order.performerOrders.reduce((acc, respond) =>
                        `${acc}${respond.performer.displayName} (8${respond.performer.phone}),\n`,
                        ''
                    ),
                    'Время работы': order.timeWorked,
                    'Поступления': order.income,
                    'Оплата грузчикам': order.performerPayment,
                    'Налоги': order.tax,
                    'Профит': order.profit,
                    'Широта': order.lat,
                    'Долгота': order.lng,
                    'Менеджер': order.manager.displayName,
                    'Телефон менеджера': `8${order.manager.phone}`,
                    'Комментарий менеджера': order.managerCommentary,
                    'Статус': order.status
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

    createOrder: RequestHandler = async (req, res): Promise<void> => {
        try {
            const orderDto = plainToInstance(OrderDto, req.body);
            if (req.app.locals.user.role === ERole.manager || req.app.locals.user.role === ERole.admin) {
                // Если заказ создает менеджер
                if (!orderDto.managerId) {
                    orderDto.managerId = req.app.locals.user.id;
                }
                if (!orderDto.customerId) {
                    if (!orderDto.displayName || !orderDto.phone) {
                        res.status(400).send({
                            success: false,
                            message: 'No client was selected'
                        });
                    }
                    // Проверяем наличие пользователя в БД по номеру телефона и роли клиента
                    const user = await this.authService.getUserByPhoneAndRole(orderDto.phone, ERole.customer);
                    // Если пользователь не найден
                    if (!user) {
                        // Создаем клиента
                        const registerUserByManager = plainToInstance(RegisterUserByManager, req.body);
                        registerUserByManager.role = ERole.customer;
                        const createdCustomer = await this.authService.addUser(registerUserByManager);
                        orderDto.customerId = createdCustomer.id;
                    } else {
                        orderDto.customerId = user.id;
                    }
                }
            } else {
                // Если заказ создает клиент
                orderDto.customerId = req.app.locals.user.id;
                orderDto.managerId = 1;
            }
            const errors = await validate(orderDto);
            if (errors.length) throw errors;
            const createdOrder = await this.service.createOrder(orderDto);
            if (createdOrder) {
                res.send(createdOrder);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'order wasn\'t created'
                });
            }
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

    cancelOrder: RequestHandler = async (req, res): Promise<void> => {
        try {
            const canceledOrder = await this.service.cancelOrder(parseInt(req.params.id));
            if (canceledOrder) {
                res.send(canceledOrder);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'order wasn\'t canceled'
                });
            }
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


}
