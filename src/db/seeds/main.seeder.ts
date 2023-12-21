import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../entities/user.entity';
import { ERole } from '../../enum/ERole.enum';
import { Service } from '../../entities/service.entity';
import { Order } from '../../entities/order.entity';
import { IUser } from '../../interfaces/IUser.interface';
import { IService } from '../../interfaces/IService.interface';
import { PerformerOrder } from '../../entities/performerOrder.entity';
import { IOrder } from '../../interfaces/IOrder.interface';

const managers: IUser[] = [];
const customers: IUser[] = [];
const performers: IUser[] = [];
const services: IService[] = [];
const orders: IOrder[] = [];
const performerOrders: string[] = [];

const generateRandomDate = (): string => {
    const year = Math.floor(Math.random() * (2005 - 1994) + 1994);
    const month = Math.floor(Math.random() * 12) + 1;
    const day = Math.floor(Math.random() * 28) + 1;
    const date = new Date(year, month - 1, day);

    return date.toISOString();
}

export default class MainSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userFactory = factoryManager.get(User);
        const admin = await userFactory.save({ role: ERole.admin });
        managers.push(admin);

        const manager1 = await userFactory.save({ role: ERole.manager });
        managers.push(manager1);
        const { phone, displayName } = manager1;

        const newManagers = await userFactory.saveMany(3, { role: ERole.manager });
        newManagers.forEach(manager => managers.push(manager));

        const customer1 = await userFactory.save({ phone, displayName, role: ERole.customer });
        customers.push(customer1);

        const newCustomers = await userFactory.saveMany(4, { role: ERole.customer });
        newCustomers.forEach(customer => customers.push(customer));

        const performer1 = await userFactory.save({ phone, displayName, role: ERole.performer, birthday: generateRandomDate() });
        performers.push(performer1);

        for (let i = 0; i < 20; i++) {
            const newPerformer = await userFactory.save({ role: ERole.performer, birthday: generateRandomDate() });
            performers.push(newPerformer);
        }

        const serviceFactory = factoryManager.get(Service);
        const heaver = await serviceFactory.save({ name: "Грузчик", price: 5000 });
        const freightTransport = await serviceFactory.save({ name: "Грузовой транспорт", price: 8000 });
        services.push(heaver);
        services.push(freightTransport);
        const orderFactory = factoryManager.get(Order);

        for (let i = 0; i < 100; i++) {
            const order = await orderFactory.save({
                customerId: customers[Math.floor(Math.random() * customers.length)].id,
                managerId: managers[Math.floor(Math.random() * managers.length)].id,
            })
            orders.push(order);
        }

        const performerOrderFactory = factoryManager.get(PerformerOrder);

        for (let i = 0; i < 20; i++) {
            const randomOrder = orders[Math.floor(Math.random() * orders.length)];

            for (let k = 0; k < randomOrder.performersQuantity; k++) {
                const randomPerformer = performers[Math.floor(Math.random() * performers.length)];
                if (!performerOrders.includes(`${randomOrder.id}-${randomPerformer.id}`)) {
                    performerOrders.push(`${randomOrder.id}-${randomPerformer.id}`);
                    await performerOrderFactory.save({
                        performerId: randomPerformer.id,
                        orderId: randomOrder.id,
                    })
                }
            }

            // удаляем заказы, на которые были созданы performerOrders, чтобы не повторяться
            let indexToRemove = -1;
            for (let i = 0; i < orders.length; i++) {
                if (orders[i].id === randomOrder.id) {
                    indexToRemove = i;
                    break;
                }
            }
            if (indexToRemove !== -1) {
                orders.splice(indexToRemove, 1);
            }
        }

    }
}
