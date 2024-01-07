import { Router } from "express";
import { IRoute } from '@/interfaces/IRoute.interface';
import { UserController } from "@/controllers/user.controller";
import { roleChecker } from "@/middlewares/roleChecker";
import { ERole } from "@/enum/ERole.enum";

export class UserRoute implements IRoute {
    public path = '/user';
    public router = Router();
    private controller: UserController;

    constructor() {
        this.controller = new UserController();
        this.init();
    }

    private init() {
        this.router.get('/', roleChecker([ERole.admin, ERole.manager]), this.controller.getUsers);
        this.router.post('/addUser', roleChecker([ERole.admin, ERole.manager]), this.controller.addUser);
        this.router.get('/export-csv', roleChecker([ERole.admin, ERole.manager]), this.controller.getUserCSV);
        this.router.get('/:id', roleChecker([ERole.admin, ERole.manager, ERole.customer, ERole.performer]), this.controller.getUser);
    }
}
