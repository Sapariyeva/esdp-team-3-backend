import { Router } from "express";
import { IRoute } from '../interfaces/IRoute.interface';
import { AuthController } from "../controllers/auth.controller";
import { roleChecker } from "../middlewares/roleChecker";
import { ERole } from "../enum/ERole.enum";

export class AuthRoute implements IRoute {
    public path = '/user';
    public router = Router();
    private controller: AuthController;

    constructor() {
        this.controller = new AuthController();
        this.init();
    }

    private init() {
        this.router.post('/signUp', this.controller.signUp);
        this.router.post('/signIn', this.controller.signIn);
        this.router.post('/signInWithRole', this.controller.signInWithRole);
        this.router.post('/signOut', this.controller.signOut);
        this.router.get('/refresh', this.controller.refresh);
        this.router.get('/', roleChecker([ERole.admin, ERole.manager]), this.controller.getUsers);
        this.router.get('/:id', roleChecker([ERole.admin, ERole.manager, ERole.customer, ERole.performer]), this.controller.getUser);
    }
}
