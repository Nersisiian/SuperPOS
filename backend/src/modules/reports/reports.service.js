"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReportsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const order_entity_1 = require("../orders/order.entity");
const order_item_entity_1 = require("../orders/order-item.entity");
let ReportsService = class ReportsService {
    constructor(orderRepo, itemRepo) {
        this.orderRepo = orderRepo;
        this.itemRepo = itemRepo;
    }
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
        return raw.map((r) => ({ date: r.date, total: Number(r.total || 0) }));
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
        return raw.map((r) => ({ barcode: r.barcode, name: r.name, sold: Number(r.sold || 0) }));
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
};
exports.ReportsService = ReportsService;
exports.ReportsService = ReportsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(order_entity_1.Order)),
    __param(1, (0, typeorm_1.InjectRepository)(order_item_entity_1.OrderItem)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ReportsService);
//# sourceMappingURL=reports.service.js.map