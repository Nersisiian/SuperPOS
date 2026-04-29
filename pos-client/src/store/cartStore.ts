import { create } from 'zustand';

export interface CartItem {
  barcode: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (barcode: string, name: string, price: number) => void;
  removeItem: (barcode: string) => void;
  updateQuantity: (barcode: string, qty: number) => void;
  clearCart: () => void;
  total: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (barcode, name, price) => {
    const existing = get().items.find(i => i.barcode === barcode);
    if (existing) {
      set({
        items: get().items.map(i =>
          i.barcode === barcode ? { ...i, quantity: i.quantity + 1 } : i
        ),
      });
    } else {
      set({ items: [...get().items, { barcode, name, price, quantity: 1 }] });
    }
  },
  removeItem: (barcode) =>
    set({ items: get().items.filter(i => i.barcode !== barcode) }),
  updateQuantity: (barcode, qty) => {
    if (qty <= 0) {
      get().removeItem(barcode);
      return;
    }
    set({
      items: get().items.map(i =>
        i.barcode === barcode ? { ...i, quantity: qty } : i
      ),
    });
  },
  clearCart: () => set({ items: [] }),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));
