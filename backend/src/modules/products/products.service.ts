import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './product.entity';
import { EventsGateway } from '../../events/events.gateway';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product) private repo: Repository<Product>,
    private eventsGateway: EventsGateway,
  ) {}

  async findByBarcode(barcode: string): Promise<Product | null> {
    return this.repo.findOne({ where: { barcode, isActive: true } });
  }

  async search(query: string): Promise<Product[]> {
    return this.repo.createQueryBuilder('p')
      .where('p.name LIKE :q OR p.barcode = :b', { q: '%' + query + '%', b: query })
      .take(20).getMany();
  }

  async create(dto: Partial<Product>): Promise<Product> {
    const product = this.repo.create(dto);
    const saved = await this.repo.save(product);
    this.eventsGateway.broadcastProductUpdate(saved);
    return saved;
  }

  async updateStock(id: string, change: number) {
    await this.repo.decrement({ id }, 'stockQuantity', Math.abs(change));
  }

  async getAllActive(): Promise<Product[]> {
    return this.repo.find({ where: { isActive: true } });
  }
}
