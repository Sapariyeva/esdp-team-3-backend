import { Router } from "express";
import { IRoute } from '../interfaces/IRoute.interface';

import { roleChecker } from "../middlewares/roleChecker";
import { ERole } from "../interfaces/ERole.enum";
import { PerformerOrderController } from "../controllers/performerOrder.controller";

export class PerformerOrderRoute implements IRoute {
	public path = '/performerOrder';
	public router = Router();
	private controller: PerformerOrderController;

	constructor() {
		this.controller = new PerformerOrderController();
		this.init();
	}

	private init() {
		this.router.patch('/', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.respondToOrder);
		this.router.patch('/:id/cancel', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.rejectOrder);
		this.router.patch('/:id/notifyArrival', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.notifyArrival);
		this.router.patch('/:id/notifyCompletion', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.notifyCompletion);
	}
}