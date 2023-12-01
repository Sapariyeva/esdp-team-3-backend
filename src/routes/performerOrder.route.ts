import { Router } from "express";
import { IRoute } from '../interfaces/IRoute.interface';

import { roleChecker } from "../middlewares/roleChecker";
import { ERole } from "../interfaces/ERole.enum";
import { PerformerOrderController } from "../controllers/PerformerOrder.controller";

export class PerformerOrderRoute implements IRoute {
  public path = '/performerOrder';
  public router = Router();
  private controller: PerformerOrderController;

  constructor() {
    this.controller = new PerformerOrderController();
    this.init();
  }

  private init() {
    this.router.post('/', roleChecker([ERole.admin, ERole.manager, ERole.performer]),
      this.controller.createPerformerOrder.bind(this.controller));

    this.router.patch('/startOrder', roleChecker([ERole.admin, ERole.manager, ERole.performer]),
      this.controller.startOrder.bind(this.controller));

    this.router.patch('/endOrder', roleChecker([ERole.admin, ERole.manager, ERole.performer]),
      this.controller.endOrder.bind(this.controller));

    this.router.patch('/disableOrder', roleChecker([ERole.admin, ERole.manager, ERole.performer]),
      this.controller.disableOrder.bind(this.controller));
  }
}