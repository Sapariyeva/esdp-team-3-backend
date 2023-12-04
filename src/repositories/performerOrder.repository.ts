import { Repository } from 'typeorm';
import { appDataSource } from '../dataSource';
import { PerformerOrder } from '../entities/performerOrder.entity';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { EPerformerOrderStatus } from '../interfaces/EPerformerOrderStatus.enum';
import { OrderResponseDto } from '../dto/orderResponse.dto';

export class PerformerOrderRepository extends Repository<PerformerOrder> {
	constructor() {
		super(PerformerOrder, appDataSource.createEntityManager());
	}

	// async getPerformerOrderByOrderIdAndPerformerId(order_id: number, performer_id: number): Promise<IPerformerOrder | null> {
	// 	return await this.findOne({ where: { order_id, performer_id } });
	// }

  async updatePerformerOrderStatus(order_id: number, performer_id: number, status: EPerformerOrderStatus): Promise<IPerformerOrder | null> {
    const performerOrder = await this.findOne({ where: { order_id: order_id, performer_id: performer_id } });

    if (performerOrder) {
      performerOrder.status = status;
      return await this.save(performerOrder);
    } else {
      return null;
    }
  }

  async createPerformerOrder(data: OrderResponseDto): Promise<IPerformerOrder> {
    const performerOrder = new PerformerOrder();
    performerOrder.order_id = data.order_id;
    performerOrder.performer_id = data.performer_id;
    performerOrder.status = EPerformerOrderStatus.WAITING;
    return await this.save(performerOrder);
  }

  async updatePerformerOrderStart(order_id: number, performer_id: number, start: string): Promise<IPerformerOrder | null> {
    const performerOrder = await this.findOne({ where: { order_id: order_id, performer_id: performer_id } });

    if (performerOrder) {
      performerOrder.start = start;
      return await this.save(performerOrder);
    } else {
      return null;
    }
  }

  async updatePerformerOrderEnd(order_id: number, performer_id: number, end: string): Promise<IPerformerOrder | null> {
    const performerOrder = await this.findOne({ where: { order_id: order_id, performer_id: performer_id } });

    if (performerOrder) {
      performerOrder.end = end;
      return await this.save(performerOrder);
    } else {
      return null;
    }
  }


}