import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
  ) {}

  async dailySales(days = 7) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const raw = await this.orderRepo
      .createQueryBuilder('order')
      .select("DATE(order.createdAt) as date")
      .addSelect("SUM(order.totalAmount)", "total")
      .where("order.createdAt >= :start", { start: startDate.toISOString() })
      .groupBy("DATE(order.createdAt)")
      .orderBy("date", "ASC")
      .getRawMany();
    return raw.map((r: any) => ({ date: r.date, total: Number(r.total || 0) }));
  }

  async topProducts(days = 30, limit = 10) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);

    const raw = await this.itemRepo
      .createQueryBuilder('item')
      .select("item.barcode", "barcode")
      .addSelect("item.name", "name")
      .addSelect("SUM(item.quantity)", "sold")
      .innerJoin('item.order', 'order')
      .where("order.createdAt >= :start", { start: startDate.toISOString() })
      .groupBy("item.barcode")
      .orderBy("sold", "DESC")
      .limit(limit)
      .getRawMany();
    return raw.map((r: any) => ({ barcode: r.barcode, name: r.name, sold: Number(r.sold || 0) }));
  }

  async summary() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 7);

    const todayData = await this.orderRepo
      .createQueryBuilder('order')
      .select("COUNT(order.id)", "count")
      .addSelect("COALESCE(SUM(order.totalAmount),0)", "total")
      .where("order.createdAt >= :today", { today: today.toISOString() })
      .getRawOne();

    const weekData = await this.orderRepo
      .createQueryBuilder('order')
      .select("COUNT(order.id)", "count")
      .addSelect("COALESCE(SUM(order.totalAmount),0)", "total")
      .where("order.createdAt >= :week", { week: weekAgo.toISOString() })
      .getRawOne();

    return {
      todaySales: Number(todayData?.total || 0),
      todayOrders: Number(todayData?.count || 0),
      weekSales: Number(weekData?.total || 0),
      weekOrders: Number(weekData?.count || 0),
    };
  }
}
