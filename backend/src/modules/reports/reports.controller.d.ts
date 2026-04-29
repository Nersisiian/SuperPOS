import { ReportsService } from './reports.service';
export declare class ReportsController {
    private readonly reportsService;
    constructor(reportsService: ReportsService);
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
