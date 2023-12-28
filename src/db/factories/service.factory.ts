import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Service } from '@/entities/service.entity';

export const ServiceFactory = setSeederFactory(Service, (faker: Faker) => {
    const service = new Service();
    return service;
})