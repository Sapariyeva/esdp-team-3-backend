import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '../../entities/user.entity';
import { ERole } from '../../interfaces/ERole.enum';

const roles = [ERole.admin, ERole.manager, ERole.customer, ERole.performer];

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
    const user = new User();
    user.phone = faker.number.int(9).toString();
    user.display_name = faker.person.firstName();
    user.password = 'password';
    user.role = faker.helpers.arrayElement(roles);
    return user;
})