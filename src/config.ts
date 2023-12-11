import { DataSourceOptions } from "typeorm";
import { User } from "./entities/user.entity";
import { SeederOptions } from 'typeorm-extension';
import { UserFactory } from "./db/factories/user.factory";
import MainSeeder from "./db/seeds/main.seeder";
import { Order } from "./entities/order.entity";
import { Service } from "./entities/service.entity";
import { ServiceFactory } from "./db/factories/service.factory";
import { OrderFactory } from "./db/factories/order.factory";
import { PerformerOrder } from "./entities/performerOrder.entity";
import dotenv from "dotenv";
import * as process from "process";

dotenv.config();

export const appDBConnect: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: true,
    entities: [
        User,
        Service,
        Order,
        PerformerOrder
    ],
    seeds: [
        MainSeeder,
    ],
    factories: [
        UserFactory,
        ServiceFactory,
        OrderFactory
    ]
}