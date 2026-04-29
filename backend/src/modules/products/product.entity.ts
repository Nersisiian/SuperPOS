import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('products')
export class Product {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ unique: true }) barcode: string;
  @Column() name: string;
  @Column('decimal', { precision: 10, scale: 2 }) price: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) cost: number;
  @Column({ default: 'EA' }) unit: string;
  @Column({ default: 0 }) stockQuantity: number;
  @Column({ nullable: true }) category: string;
  @Column({ default: true }) isActive: boolean;
  @CreateDateColumn() createdAt: Date;
  @UpdateDateColumn() updatedAt: Date;
}