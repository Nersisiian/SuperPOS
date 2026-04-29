import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Input, message, Space, Tag } from 'antd';
import axios from 'axios';

const ProductsPage = () => {
  const [products, setProducts] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    barcode: '', name: '', price: 0, stockQuantity: 0, cost: 0, unit: 'EA'
  });

  const fetchProducts = async () => {
    try {
      const res = await axios.get('/api/products');
      setProducts(res.data);
    } catch { message.error('Cannot fetch products'); }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAdd = async () => {
    try {
      await axios.post('/api/products', formData);
      message.success('Product added');
      setIsModalOpen(false);
      fetchProducts();
    } catch { message.error('Error adding product'); }
  };

  const columns = [
    { title: 'Barcode', dataIndex: 'barcode' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Price', dataIndex: 'price', render: (v: number) => `$${v}` },
    { title: 'Cost', dataIndex: 'cost', render: (v: number) => `$${v}` },
    { title: 'Stock', dataIndex: 'stockQuantity' },
    { title: 'Unit', dataIndex: 'unit' },
    { title: 'Status', dataIndex: 'isActive',
      render: (v: boolean) => v ? <Tag color="green">Active</Tag> : <Tag color="red">Inactive</Tag>
    },
  ];

  return (
    <>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Add Product
      </Button>
      <Table dataSource={products} columns={columns} rowKey="id" />
      <Modal title="New Product" open={isModalOpen} onOk={handleAdd} onCancel={() => setIsModalOpen(false)}>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input placeholder="Barcode" value={formData.barcode}
            onChange={e => setFormData({...formData, barcode: e.target.value})} />
          <Input placeholder="Name" value={formData.name}
            onChange={e => setFormData({...formData, name: e.target.value})} />
          <Input type="number" placeholder="Price" value={formData.price}
            onChange={e => setFormData({...formData, price: +e.target.value})} />
          <Input type="number" placeholder="Cost" value={formData.cost}
            onChange={e => setFormData({...formData, cost: +e.target.value})} />
          <Input type="number" placeholder="Stock Qty" value={formData.stockQuantity}
            onChange={e => setFormData({...formData, stockQuantity: +e.target.value})} />
        </Space>
      </Modal>
    </>
  );
};

export default ProductsPage;
