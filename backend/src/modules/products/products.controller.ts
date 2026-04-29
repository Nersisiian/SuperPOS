import { Controller, Get, Param, Query, Post, Body } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Get('barcode/:code') getByBarcode(@Param('code') code: string) { return this.service.findByBarcode(code); }
  @Get('search') search(@Query('q') q: string) { return this.service.search(q || ''); }
  @Get() getAll() { return this.service.getAllActive(); }
  @Post() create(@Body() dto: any) { return this.service.create(dto); }
}