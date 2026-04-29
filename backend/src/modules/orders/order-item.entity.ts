import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid') id: string;
  @ManyToOne(() => Order) @JoinColumn({ name: 'orderId' }) order: Order;
  @Column() orderId: string;
  @Column() productId: string;
  @Column() barcode: string;
  @Column() name: string;
  @Column('decimal', { precision: 10, scale: 2 }) unitPrice: number;
  @Column() quantity: number;
  @Column('decimal', { precision: 10, scale: 2, default: 0 }) discount: number;
}