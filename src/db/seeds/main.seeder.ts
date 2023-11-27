import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';
import { User } from '../../entities/user.entity';
import { ERole } from '../../interfaces/ERole.enum';

export default class MainSeeder implements Seeder {
    public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<void> {
        const userFactory = factoryManager.get(User);
        await userFactory.save({ role: ERole.admin });
        await userFactory.save({ role: ERole.manager });
        await userFactory.saveMany(2, { role: ERole.customer });
        await userFactory.saveMany(4, { role: ERole.performer });
    }
}
