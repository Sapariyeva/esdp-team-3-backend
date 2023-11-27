import { RequestHandler } from "express";
import { OrderService } from "../services/order.service";
import { OrderDto } from "../dto/order.dto";
import { plainToInstance } from "class-transformer";
import { ERole } from "../interfaces/ERole.enum";
import { AuthService } from "../services/auth.service";
import { RegisterUserByManagerDto } from "../dto/registerUserByManager.dto";

export class OrderController {
    private service: OrderService;
    private authService: AuthService;

    constructor() {
        this.service = new OrderService();
        this.authService = new AuthService();
    }

    getOrder: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const orders = await this.service.getOrders();
            if (orders.length !== 0) {
                res.send(orders);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'orders not found'
                });
            }
        } catch (e) {
            next(e);
        }
    }

    getOrders: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            const orders = await this.service.getOrders();
            if (orders.length !== 0) {
                res.send(orders);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'orders not found'
                });
            }
        } catch (e) {
            next(e);
        }
    }

    getOrdersByCustomer: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            if (!req.query.customer) {
                next();
            } else {
                const orders = await this.service.getOrdersByCustomer(Number(req.query.customer));
                if (orders) {
                    res.send(orders);
                } else {
                    res.status(400).send({
                        success: false,
                        message: 'orders not found'
                    });
                }
            }
        } catch (e) {
            next(e);
        }
    }

    getOrdersByManager: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            if (!req.query.manager) {
                next();
            } else {
                const orders = await this.service.getOrdersByManager(Number(req.query.manager));
                if (orders) {
                    res.send(orders);
                } else {
                    res.status(400).send({
                        success: false,
                        message: 'orders not found'
                    });
                }
            }
        } catch (e) {
            next(e);
        }
    }

    createOrder: RequestHandler = async (req, res): Promise<void> => {
        try {
            const orderDto = plainToInstance(OrderDto, req.body);
            if (req.app.locals.user.role === ERole.manager || req.app.locals.user.role === ERole.admin) {
                // Если заказ создает менеджер
                orderDto.manager_id = req.app.locals.user.id;
                if (!orderDto.customer_id) {
                    if (!orderDto.display_name || !orderDto.phone) {
                        res.status(400).send({
                            success: false,
                            message: 'No client was selected'
                        });
                    }
                    // Проверяем наличие пользователя в БД по номеру телефона и роли клиента
                    const user = await this.authService.getUserByPhone(orderDto.phone, ERole.customer);
                    // Если пользователь не найден
                    if (!user) {
                        // Создаем клиента
                        const registerUserByManager = plainToInstance(RegisterUserByManagerDto, req.body);
                        registerUserByManager.role = ERole.customer;
                        const createdCustomer = await this.authService.addUser(registerUserByManager);
                        orderDto.customer_id = createdCustomer.id;
                    } else {
                        orderDto.customer_id = user.id;
                    }
                }
            } else {
                // Если заказ создает клиент
                orderDto.customer_id = req.app.locals.user.id;
                orderDto.manager_id = 1;
            }
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
