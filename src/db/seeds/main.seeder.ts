import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../entities/user.entity';
import { ERole } from '../../interfaces/ERole.enum';
import { Service } from '../../entities/service.entity';
import { Order } from '../../entities/order.entity';
import { IUser } from '../../interfaces/IUser.interface';
import { IService } from '../../interfaces/IService.interface';

const managers: IUser[] = [];
const customers: IUser[] = [];
const performers: IUser[] = [];
const services: IService[] = [];

export default class MainSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userFactory = factoryManager.get(User);
        const admin = await userFactory.save({ role: ERole.admin });
        managers.push(admin);

        const manager1 = await userFactory.save({ role: ERole.manager });
        managers.push(manager1);
        const { phone, display_name } = manager1;

        const newManagers = await userFactory.saveMany(3, { role: ERole.manager });
        newManagers.forEach(manager => managers.push(manager));

        const customer1 = await userFactory.save({ phone, display_name, role: ERole.customer });
        customers.push(customer1);

        const newCustomers = await userFactory.saveMany(4, { role: ERole.customer });
        newCustomers.forEach(customer => customers.push(customer));

        const performer1 = await userFactory.save({ phone, display_name, role: ERole.performer });
        performers.push(performer1);

        const newPerformers = await userFactory.saveMany(6, { role: ERole.performer });
        newPerformers.forEach(performer => performers.push(performer));

        const serviceFactory = factoryManager.get(Service);
        const heaver = await serviceFactory.save({ name: "Грузчик", price: 5000 });
        const freightTransport = await serviceFactory.save({ name: "Грузовой транспорт", price: 8000 });
        services.push(heaver);
        services.push(freightTransport);
        const orderFactory = factoryManager.get(Order);

        for (let i = 0; i < 100; i++) {
            await orderFactory.save({
                customer_id: customers[Math.floor(Math.random() * customers.length)].id,
                manager_id: managers[Math.floor(Math.random() * managers.length)].id,
            })
        }
    }
}
