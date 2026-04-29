import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('promotions')
export class Promotion {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column() type: string; // e.g., 'buyXgetY', 'percent', 'fixed'
  @Column() productBarcode: string; // if specific product
  @Column('int', { default: 1 }) requiredQty: number;
  @Column('int', { default: 0 }) freeQty: number;
  @Column('decimal', { precision: 5, scale: 2, default: 0 }) discountPercent: number;
  @Column({ default: true }) isActive: boolean;
}