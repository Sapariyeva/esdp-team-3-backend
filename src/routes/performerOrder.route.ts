import { Router } from "express";
import { IRoute } from '@/interfaces/IRoute.interface';
import { roleChecker } from "@/middlewares/roleChecker";
import { PerformerOrderController } from "@/controllers/performerOrder.controller";
import { ERole } from "@/enum/ERole.enum";

export class PerformerOrderRoute implements IRoute {
	public path = '/performerOrder';
	public router = Router();
	private controller: PerformerOrderController;

	constructor() {
		this.controller = new PerformerOrderController();
		this.init();
	}

	private init() {
		this.router.post('/', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.respondToOrder);
		this.router.patch('/:id/delete', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.deleteOrder);
		this.router.patch('/:id/block', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.rejectOrder);
		this.router.patch('/:id/notifyStart', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.notifyStart);
		this.router.patch('/:id/notifyArrival', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.notifyArrival);
		this.router.patch('/:id/notifyCompletion', roleChecker([ERole.admin, ERole.manager, ERole.performer]), this.controller.notifyCompletion);
	}
}