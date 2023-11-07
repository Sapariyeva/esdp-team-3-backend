import { Router } from "express";
import { IRoute } from '../interfaces/IRoute.interface';
import { AuthController } from "../controllers/auth.controller";

export class AuthRoute implements IRoute {
    public path = '/users';
    public router = Router();
    private controller: AuthController;

    constructor() {
        this.controller = new AuthController();
        this.init();
    }

    private init() {
        this.router.post('/', this.controller.signUp);
        this.router.post('/sessions', this.controller.signIn);
        this.router.post('/signOut', this.controller.signOut);
    }
}
