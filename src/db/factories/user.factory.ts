import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { User } from '@/entities/user.entity';
import { ERole } from '@/enum/ERole.enum';

const roles = [ERole.admin, ERole.manager, ERole.customer, ERole.performer];

export const UserFactory = setSeederFactory(User, (faker: Faker) => {
    const user = new User();
    user.phone = faker.number.int({ min: 7000000000, max: 7999999999 }).toString();
    user.displayName = `${faker.person.firstName()} ${faker.person.lastName()}`;
    user.password = 'password';
    user.hashPassword();
    user.role = faker.helpers.arrayElement(roles);
    return user;
})