import { RequestHandler } from "express";
import { OrderService } from "../services/order.service";
import { OrderDto } from "../dto/order.dto";
import { plainToInstance } from "class-transformer";
import { ERole } from "../enum/ERole.enum";
import { AuthService } from "../services/auth.service";
import { UserWithRoleDto } from "../dto/userWithRole.dto";

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
        } catch (e) {
            next(e);
        }
    }

    getOrders: RequestHandler = async (req, res, next): Promise<void> => {
        try {
            let manager_id = null;
            let customer_id = null;
            let performer_id = null;
            const offset = req.query.offset ? parseInt(req.query.offset as string) : 0;
            const limit = req.query.limit ? parseInt(req.query.limit as string) : 20;
            if (req.query.manager) {
                const manager = await this.authService.getUserByIdAndRole(Number(req.query.manager), ERole.manager);
                if (!manager) {
                    res.status(400).send({
                        success: false,
                        message: 'there is no such manager'
                    });
                } else {
                    manager_id = manager.id;
                }
            }
            if (req.query.customer) {
                const customer = await this.authService.getUserByIdAndRole(Number(req.query.customer), ERole.customer);
                if (!customer) {
                    res.status(400).send({
                        success: false,
                        message: 'there is no such customer'
                    });
                } else {
                    customer_id = customer.id;
                }
            }
            if (req.query.performer) {
                const performer = await this.authService.getUserByIdAndRole(Number(req.query.performer), ERole.performer);
                if (!performer) {
                    res.status(400).send({
                        success: false,
                        message: 'there is no such performer'
                    });
                } else {
                    performer_id = performer.id;
                }
            }
            const params = { offset, limit, manager_id, customer_id, performer_id };
            console.log('test')
            const result = await this.service.getOrders(params);

            if (result.orders.length !== 0) {
                res.send(result);
            } else {
                res.status(400).send({
                    success: false,
                    message: 'Orders not found'
                });
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
                    const user = await this.authService.getUserByPhoneAndRole(orderDto.phone, ERole.customer);
                    // Если пользователь не найден
                    if (!user) {
                        // Создаем клиента
                        const registerUserByManager = plainToInstance(UserWithRoleDto, req.body);
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
