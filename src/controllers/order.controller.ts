import { RequestHandler } from "express";
import { OrderService } from "../services/order.service";
import { OrderDto } from "../dto/order.dto";
import { plainToInstance } from "class-transformer";
import { ERole } from "../enum/ERole.enum";
import { AuthService } from "../services/auth.service";
import { getOrderParams } from "../dto/getOrderParams.dto";
import { validate } from "class-validator";
import { EOrderStatus } from "../enum/EOrderStatus.enum";
import { RegisterUserByManager } from "../dto/registerUserByManager.dto";

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
                    message: 'orders not found'
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
            const { customer, manager, performer, status } = req.query;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            const plainData = {
                customer: customer ? parseInt(customer as string) : null,
                manager: manager ? parseInt(manager as string) : null,
                performer: performer ? parseInt(performer as string) : null,
                status: status ? status as EOrderStatus : null
            };
            const paramsDto = plainToInstance(getOrderParams, plainData);
            const errors = await validate(paramsDto);
            if (errors.length) throw errors;
            const result = await this.service.getOrders({ ...paramsDto, offset, limit });

            if (result.orders.length !== 0) {
                res.send(result);
            } else {
                res.status(400).send({
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

    createOrder: RequestHandler = async (req, res): Promise<void> => {
        try {
            const orderDto = plainToInstance(OrderDto, req.body);
            if (req.app.locals.user.role === ERole.manager || req.app.locals.user.role === ERole.admin) {
                // Если заказ создает менеджер
                orderDto.managerId = req.app.locals.user.id;
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
