import { RequestHandler } from "express";
import { OrderService } from "../services/order.service";
import { UserRepository } from "../repositories/user.repository";
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

    getOrders: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            let token = req.headers['authorization'];
            if (req.headers && token) {
                if (token.startsWith('Bearer ')) token = token.slice(7);
                const userRepository = new UserRepository();
                const user = await userRepository.getUserByToken(token);
                if (user) {
                    const orders = await this.service.getOrders();
                    if (orders.length !== 0) {
                        res.send(orders);
                    } else {
                        res.status(400).send({
                            success: false,
                            message: 'orders not found'
                        });
                    }
                } else {
                    res.status(401).send({
                        success: false,
                        message: 'wrong token'
                    })
                }
            } else {
                throw new Error('There is no authorization token')
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
                    // Создаем клиента
                    const registerUserByManager = plainToInstance(RegisterUserByManagerDto, req.body);
                    registerUserByManager.role = ERole.customer;
                    const createdCustomer = await this.authService.addUser(registerUserByManager);
                    orderDto.customer_id = createdCustomer.id;
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

    changeOrderStatus: RequestHandler = async (req, res): Promise<void> => {
        try {
            const updatedOrder = await this.service.changeOrderStatus(req.body.order_id, req.body.order_status);
            if (updatedOrder) {
                res.send(updatedOrder);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'order wasn\'t updated'
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
