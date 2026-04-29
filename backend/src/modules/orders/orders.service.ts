import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './order.entity';
import { OrderItem } from './order-item.entity';
import { ProductsService } from '../products/products.service';
import { PromotionsService, CartItemForPromo } from '../promotions/promotions.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(OrderItem) private itemRepo: Repository<OrderItem>,
    private productsService: ProductsService,
    private promotionsService: PromotionsService,
  ) {}

  async createOrder(dto: {
    items: { barcode: string; quantity: number }[];
    paymentMethod: string;
    cashRegisterId?: string;
    externalId?: string;
  }): Promise<Order> {
    // ??????? ????? ??? ?????????
    const order = this.orderRepo.create({
      cashRegisterId: dto.cashRegisterId || 'REG-001',
      paymentMethod: dto.paymentMethod || 'CASH',
      externalId: dto.externalId,
      totalAmount: 0,
      discountAmount: 0,
    });
    const savedOrder = await this.orderRepo.save(order);

    const cartItems: CartItemForPromo[] = [];
    for (const item of dto.items) {
      const product = await this.productsService.findByBarcode(item.barcode);
      if (product) cartItems.push({ barcode: item.barcode, quantity: item.quantity, originalPrice: product.price });
    }

    const { totalDiscount } = await this.promotionsService.applyPromotions(cartItems);
    let total = 0;

    for (const item of dto.items) {
      const product = await this.productsService.findByBarcode(item.barcode);
      if (!product) continue;
      const rawSum = cartItems.reduce((sum, i) => sum + i.originalPrice * i.quantity, 1);
      const lineDiscount = totalDiscount * (product.price * item.quantity) / rawSum;
      const lineTotal = (product.price * item.quantity) - lineDiscount;
      total += lineTotal;
      // ??????? ??????? ?????? ? ????? orderId
      await this.itemRepo.save({
        orderId: savedOrder.id,
        productId: product.id,
        barcode: product.barcode,
        name: product.name,
        unitPrice: product.price,
        quantity: item.quantity,
        discount: lineDiscount,
      });
      await this.productsService.updateStock(product.id, -item.quantity);
    }

    // ????????? ???????? ????? ??????
    savedOrder.totalAmount = total;
    savedOrder.discountAmount = totalDiscount;
    return this.orderRepo.save(savedOrder);
  }
}
