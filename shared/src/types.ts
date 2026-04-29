export interface Product {
  id: string;
  barcode: string;
  name: string;
  price: number;
  cost: number;
  unit: string;
  stockQuantity: number;
  category?: string;
  isActive: boolean;
}

export interface OrderItem {
  productId: string;
  barcode: string;
  name: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

export interface Order {
  id: string;
  cashRegisterId: string;
  items: OrderItem[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}