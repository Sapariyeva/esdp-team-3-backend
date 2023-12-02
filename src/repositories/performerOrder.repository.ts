import { Repository } from 'typeorm';
import { appDataSource } from '../dataSource';
import { PerformerOrder } from '../entities/performerOrder.entity';
import { PerformerOrderDto } from '../dto/performerOrder.dto';
import { IPerformerOrder } from '../interfaces/IPerformerOrder.interface';
import { EPerformerOrderStatus } from '../interfaces/EPerformerOrderStatus.enum';

export class PerformerOrderRepository extends Repository<PerformerOrder> {
  constructor() {
    super(PerformerOrder, appDataSource.createEntityManager());
  }

  async getPerformerOrderByOrderIdAndPerformerId(order_id: number, performer_id: number): Promise<IPerformerOrder | null> {
    return await this.findOne({ where: { order_id, performer_id } });
  }

  async updatePerformerOrderStatus(order_id: number, performer_id: number, status: EPerformerOrderStatus): Promise<IPerformerOrder | null> {
    const updatedPerformerOrder = await this.update({ order_id: order_id, performer_id: performer_id }, { status });
    if (updatedPerformerOrder.affected && updatedPerformerOrder.affected > 0) {
      return updatedPerformerOrder.raw[0] as IPerformerOrder;
    } else {
      return null;
    }
  }

  async createPerformerOrder(data: PerformerOrderDto): Promise<IPerformerOrder> {
    const performerOrder = new PerformerOrder();
    performerOrder.order_id = data.order_id;
    performerOrder.performer_id = data.performer_id;
    const savedPerformerOrder = await this.save(performerOrder);
    return savedPerformerOrder;
  } 

  async updatePerformerOrderStart(order_id: number, performer_id: number, start: Date): Promise<IPerformerOrder | null> {
    const updatedPerformerOrder = await this.update({ order_id: order_id, performer_id: performer_id }, { start });
    if (updatedPerformerOrder.affected && updatedPerformerOrder.affected > 0) {
      return updatedPerformerOrder.raw[0] as IPerformerOrder;
    } else {
      return null;
    }
  }

  async updatePerformerOrderEnd(order_id: number, performer_id: number, end: Date): Promise<IPerformerOrder | null> {
    const updatedPerformerOrder = await this.update({ order_id: order_id, performer_id: performer_id }, { end });
    if (updatedPerformerOrder.affected && updatedPerformerOrder.affected > 0) {
      return updatedPerformerOrder.raw[0] as IPerformerOrder;
    } else {
      return null;
    }
  }

  
}