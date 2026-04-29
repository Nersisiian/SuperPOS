import { db, OfflineReceipt } from './db';
import axios from 'axios';

export const saveReceiptOffline = async (receipt: OfflineReceipt) => {
  await db.receipts.put(receipt);
};

export const syncPendingReceipts = async () => {
  const all = await db.receipts.toArray();
  for (const receipt of all) {
    try {
      await axios.post('/api/orders', receipt);
      await db.receipts.delete(receipt.id);
      console.log('Synced:', receipt.id);
    } catch {
      break;
    }
  }
};

export const startAutoSync = () => setInterval(syncPendingReceipts, 10000);
