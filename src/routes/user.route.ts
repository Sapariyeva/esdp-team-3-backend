import { Router } from "express";
import { IRoute } from '../interfaces/IRoute.interface';
import { AuthController } from "../controllers/auth.controller";
import { roleChecker } from "../middlewares/roleChecker";
import { ERole } from "../enum/ERole.enum";

export class UserRoute implements IRoute {
    public path = '/user';
    public router = Router();
    private controller: AuthController;

    constructor() {
        this.controller = new AuthController();
        this.init();
    }

    private init() {
        this.router.get('/', roleChecker([ERole.admin, ERole.manager]), this.controller.getUsers);
        this.router.get('/:id', roleChecker([ERole.admin, ERole.manager, ERole.customer, ERole.performer]), this.controller.getUser);
        this.router.get('/export-csv', roleChecker([ERole.admin, ERole.manager]), this.controller.getUserCSV);
    }
}
