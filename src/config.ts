import { DataSourceOptions } from "typeorm";
import { User } from "./entities/user.entity";
import { SeederOptions } from 'typeorm-extension';
import { UserFactory } from "./db/factories/user.factory";
import MainSeeder from "./db/seeds/main.seeder";

export const appDBConnect: DataSourceOptions & SeederOptions = {
    type: 'mysql',
    host: 'localhost',
    port: 3306,
    username: 'root',
    password: 'qwerty123',
    database: 'labor_resource',
    synchronize: true,
    logging: true,
    entities: [
        User,
    ],
    seeds: [
        MainSeeder,
    ],
    factories: [
        UserFactory,
    ]
}