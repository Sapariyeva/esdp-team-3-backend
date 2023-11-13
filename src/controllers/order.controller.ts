import { RequestHandler } from "express";
import { OrderService } from "../services/order.service";
import { UserRepository } from "../repositories/user.repository";

export class OrderController {
    private service: OrderService;

    constructor() {
        this.service = new OrderService();
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
}
