import Dexie, { Table } from 'dexie';

export interface CachedProduct { barcode: string; name: string; price: number; }
export interface OfflineReceipt {
  id: string;
  items: { barcode: string; quantity: number }[];
  totalAmount: number;
  paymentMethod: string;
  createdAt: string;
}

export class PosDatabase extends Dexie {
  products!: Table<CachedProduct, string>;
  receipts!: Table<OfflineReceipt, string>;

  constructor() {
    super('SuperPosDB');
    this.version(1).stores({
      products: 'barcode',
      receipts: 'id',
    });
  }
}

export const db = new PosDatabase();
