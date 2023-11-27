import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../entities/user.entity';
import { ERole } from '../../interfaces/ERole.enum';

export default class MainSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userFactory = factoryManager.get(User);
        await userFactory.save({ roles: [ERole.admin] });
        await userFactory.save({ roles: [ERole.manager] });
        await userFactory.saveMany(2, { roles: [ERole.customer] });
        await userFactory.saveMany(4, { roles: [ERole.performer] });
    }
}
