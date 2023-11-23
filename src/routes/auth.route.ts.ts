import { Router } from "express";
import { IRoute } from '../interfaces/IRoute.interface';
import { AuthController } from "../controllers/auth.controller";

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
        this.router.post('/signOut', this.controller.signOut);
    }
}
