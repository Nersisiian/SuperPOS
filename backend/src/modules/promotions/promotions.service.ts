import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Promotion } from './promotion.entity';

export interface CartItemForPromo {
  barcode: string;
  quantity: number;
  originalPrice: number;
}

@Injectable()
export class PromotionsService {
  constructor(@InjectRepository(Promotion) private promoRepo: Repository<Promotion>) {}

  async applyPromotions(items: CartItemForPromo[]): Promise<{ items: CartItemForPromo[], totalDiscount: number }> {
    const allPromos = await this.promoRepo.find({ where: { isActive: true } });
    let totalDiscount = 0;
    const modifiedItems = items.map(item => ({ ...item }));

    for (const promo of allPromos) {
      if (promo.type === 'buyXgetY') {
        modifiedItems.forEach(item => {
          if (item.barcode === promo.productBarcode && item.quantity >= promo.requiredQty) {
            const freeSets = Math.floor(item.quantity / (promo.requiredQty + promo.freeQty));
            const discount = freeSets * promo.freeQty * item.originalPrice;
            totalDiscount += discount;
            // subtract discount proportionally from item
          }
        });
      } else if (promo.type === 'percent') {
        modifiedItems.forEach(item => {
          if (item.barcode === promo.productBarcode) {
            const discount = item.originalPrice * item.quantity * (promo.discountPercent / 100);
            totalDiscount += discount;
          }
        });
      }
    }
    return { items: modifiedItems, totalDiscount };
  }
}