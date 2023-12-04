import App from './app';
import logger from './middlewares/logger';
import cors from 'cors';
import { AuthRoute } from './routes/auth.route.ts';
import { OrderRoute } from './routes/order.route';
import { PerformerOrderRoute } from './routes/performerOrder.route';

const app = new App({
  port: 8000,
  middlewares: [logger(), cors()],
  routes: [
    new AuthRoute(),
    new OrderRoute(),
    new PerformerOrderRoute()
  ],
});

app.listen();
