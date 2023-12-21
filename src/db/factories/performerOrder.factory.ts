import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { PerformerOrder } from '../../entities/performerOrder.entity';

export const PerformerOrderFactory = setSeederFactory(PerformerOrder, (faker: Faker) => {
    const performerOrder = new PerformerOrder();
    return performerOrder;
})