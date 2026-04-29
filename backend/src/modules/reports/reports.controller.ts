import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('daily-sales')
  dailySales(@Query('days') days?: number) {
    return this.reportsService.dailySales(days || 7);
  }

  @Get('top-products')
  topProducts(@Query('days') days?: number, @Query('limit') limit?: number) {
    return this.reportsService.topProducts(days || 30, limit || 10);
  }

  @Get('summary')
  summary() {
    return this.reportsService.summary();
  }
}
