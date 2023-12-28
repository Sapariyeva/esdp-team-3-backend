import App from '@/app';
import logger from '@/middlewares/logger';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { AuthRoute } from '@/routes/auth.route';
import { OrderRoute } from '@/routes/order.route';
import { PerformerOrderRoute } from '@/routes/performerOrder.route';
import { UserRoute } from '@/routes/user.route';

const app = new App({
  port: 8000,
  middlewares: [
    logger(),
    cookieParser(),
    cors({
      credentials: true,
      origin: process.env.CLIENT_URL
    })
  ],
  routes: [
    new AuthRoute(),
    new UserRoute(),
    new OrderRoute(),
    new PerformerOrderRoute()
  ],
});

app.listen();
