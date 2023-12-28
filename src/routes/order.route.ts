import { Router } from "express";
import { IRoute } from '@/interfaces/IRoute.interface';
import { OrderController } from "@/controllers/order.controller";
import { roleChecker } from "@/middlewares/roleChecker";
import { ERole } from "@/enum/ERole.enum";

export class OrderRoute implements IRoute {
    public path = '/order';
    public router = Router();
    private controller: OrderController;

    constructor() {
        this.controller = new OrderController();
        this.init();
    }

    private init() {
        this.router.get('/', roleChecker([ERole.admin, ERole.manager, ERole.customer, ERole.performer]), this.controller.getOrders);
        this.router.get('/export-csv', roleChecker([ERole.admin, ERole.manager]), this.controller.getOrderCSV);
        this.router.get('/:id', roleChecker([ERole.admin, ERole.manager, ERole.customer, ERole.performer]), this.controller.getOrder);
        this.router.post('/', roleChecker([ERole.admin, ERole.manager, ERole.customer]), this.controller.createOrder);
        this.router.patch('/:id/cancel', roleChecker([ERole.admin, ERole.manager, ERole.customer]), this.controller.cancelOrder);
    }
}
