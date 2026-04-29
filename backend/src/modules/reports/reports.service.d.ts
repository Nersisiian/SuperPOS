import { Repository } from 'typeorm';
import { Order } from '../orders/order.entity';
import { OrderItem } from '../orders/order-item.entity';
export declare class ReportsService {
    private orderRepo;
    private itemRepo;
    constructor(orderRepo: Repository<Order>, itemRepo: Repository<OrderItem>);
    dailySales(days?: number): Promise<{
        date: any;
        total: number;
    }[]>;
    topProducts(days?: number, limit?: number): Promise<{
        barcode: any;
        name: any;
        sold: number;
    }[]>;
    summary(): Promise<{
        todaySales: number;
        todayOrders: number;
        weekSales: number;
        weekOrders: number;
    }>;
}
