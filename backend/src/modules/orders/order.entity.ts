import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid') id: string;
  @Column({ nullable: true }) externalId: string;
  @Column() cashRegisterId: string;
  @Column('decimal', { precision: 10, scale: 2 }) totalAmount: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) discountAmount: number;
  @Column({ default: 'CASH' }) paymentMethod: string;
  @Column({ default: false }) synced: boolean;
  @CreateDateColumn() createdAt: Date;
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true }) items: OrderItem[];
}