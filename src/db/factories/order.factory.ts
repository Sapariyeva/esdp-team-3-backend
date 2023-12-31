import { Faker } from '@faker-js/faker';
import { setSeederFactory } from 'typeorm-extension';
import { Order } from '../../entities/order.entity';
import { EOrderStatus } from '../../enum/EOrderStatus.enum';

export const OrderFactory = setSeederFactory(Order, (faker: Faker) => {
    const order = new Order();
    order.serviceId = Math.random() < 0.5 ? 1 : 2;
    order.address = faker.location.streetAddress();
    order.performersQuantity = Math.floor(Math.random() * 20) + 1;

    const currentDate = new Date();
    const randomDays = Math.floor(Math.random() * 24) + 7;
    const generatedDate = new Date(currentDate.getTime() + randomDays * 24 * 60 * 60 * 1000);
    order.orderData = generatedDate.toISOString();

    order.lat = faker.location.latitude();
    order.lng = faker.location.longitude();

    order.status = EOrderStatus.IN_PROGRESS;

    return order;
})