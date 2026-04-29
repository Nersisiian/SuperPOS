import { Controller, Post, Body, Get } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';

@Controller('orders')
export class OrdersController {
  constructor(
    private readonly ordersService: OrdersService,
    @InjectRepository(Order) private orderRepo: Repository<Order>
  ) {}

  @Post()
  create(@Body() dto: any) {
    return this.ordersService.createOrder(dto);
  }

  @Get('today-sales')
  async todaySales() {
    const result = await this.orderRepo
      .createQueryBuilder('order')
      .select('SUM(order.totalAmount)', 'sum')
      .where('order.createdAt > :today', { today: new Date().toISOString().split('T')[0] })
      .getRawOne();
    return { sum: result?.sum || 0 };
  }
}
