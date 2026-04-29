import React, { useCallback, useEffect, useState } from 'react';
import { Layout, Table, Button, Input, Space, message, InputNumber } from 'antd';
import { useCartStore } from '../store/cartStore';
import { useScanner } from '../hooks/useScanner';
import { db, OfflineReceipt } from '../lib/db';
import { saveReceiptOffline, startAutoSync } from '../lib/syncQueue';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

const { Header, Content } = Layout;

const CashierPage: React.FC = () => {
  const { items, addItem, removeItem, updateQuantity, clearCart, total } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  // Sync catalog
  useEffect(() => {
    const sync = async () => {
      try {
        const res = await axios.get('/api/products');
        await db.products.bulkPut(res.data.map((p: any) => ({
          barcode: p.barcode, name: p.name, price: p.price,
        })));
        console.log('Catalog synced');
      } catch {}
    };
    sync();
    const interval = setInterval(sync, 60000);
    return () => clearInterval(interval);
  }, []);

  // Auto sync receipts
  useEffect(() => {
    const id = startAutoSync();
    return () => clearInterval(id);
  }, []);

  const handleScan = useCallback(async (barcode: string) => {
    const cached = await db.products.get(barcode);
    if (cached) {
      addItem(cached.barcode, cached.name, cached.price);
      return;
    }
    try {
      const res = await axios.get(`/api/products/barcode/${barcode}`);
      if (res.data) {
        await db.products.put({ barcode: res.data.barcode, name: res.data.name, price: res.data.price });
        addItem(res.data.barcode, res.data.name, res.data.price);
      } else {
        message.warning('Product not found');
      }
    } catch {
      message.error('Offline: product not in cache');
    }
  }, [addItem]);

  useScanner(handleScan);

  const handleSearch = async () => {
    if (!searchText) return;
    try {
      const res = await axios.get(`/api/products/search?q=${searchText}`);
      if (res.data?.length > 0) {
        const p = res.data[0];
        addItem(p.barcode, p.name, p.price);
        setSearchText('');
      } else {
        message.info('No match');
      }
    } catch {
      message.error('Search failed');
    }
  };

  const finishOrder = async () => {
    if (items.length === 0) return;
    setLoading(true);
    const orderId = uuidv4();
    const orderData: OfflineReceipt = {
      id: orderId,
      items: items.map(i => ({ barcode: i.barcode, quantity: i.quantity })),
      totalAmount: total(),
      paymentMethod: 'CASH',
      createdAt: new Date().toISOString(),
    };
    try {
      await axios.post('/api/orders', orderData);
      message.success('Order completed');
      clearCart();
    } catch {
      await saveReceiptOffline(orderData);
      message.info('Saved offline, will sync later');
      clearCart();
    }
    setLoading(false);
  };

  const columns = [
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price', render: (v: number) => `$${v.toFixed(2)}` },
    { title: 'Qty', dataIndex: 'quantity', render: (_: any, r: any) => (
        <InputNumber min={1} value={r.quantity} onChange={(v) => updateQuantity(r.barcode, v || 1)} />
    )},
    { title: 'Total', render: (_: any, r: any) => `$${(r.price * r.quantity).toFixed(2)}` },
    { title: 'Action', render: (_: any, r: any) => <Button danger onClick={() => removeItem(r.barcode)}>Remove</Button> },
  ];

  return (
    <Layout style={{ height: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
        <h1 style={{ color: '#fff', margin: 0 }}>SuperPOS Cashier</h1>
      </Header>
      <Content style={{ padding: 24 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Space>
            <Input.Search
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              onSearch={handleSearch}
              placeholder="Scan or type barcode..."
              enterButton="Search"
              style={{ width: 300 }}
              autoFocus
            />
            <Button type="primary" onClick={finishOrder} loading={loading} disabled={items.length === 0}>
              Finish Sale (${total().toFixed(2)})
            </Button>
            <Button danger onClick={clearCart}>Clear</Button>
          </Space>
          <Table
            dataSource={items}
            columns={columns}
            rowKey="barcode"
            pagination={false}
            summary={() => (
              <Table.Summary.Row>
                <Table.Summary.Cell index={0} colSpan={4}><strong>Total</strong></Table.Summary.Cell>
                <Table.Summary.Cell index={1}><strong>${total().toFixed(2)}</strong></Table.Summary.Cell>
              </Table.Summary.Row>
            )}
          />
        </Space>
      </Content>
    </Layout>
  );
};

export default CashierPage;
