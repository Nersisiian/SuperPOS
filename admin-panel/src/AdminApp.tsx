import React, { useEffect, useState } from 'react';
import { Layout, Menu, theme } from 'antd';
import { BarChartOutlined, ShoppingOutlined } from '@ant-design/icons';
import ProductsPage from './ProductsPage';
import Dashboard from './Dashboard';

const { Header, Content, Sider } = Layout;

const AdminApp = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('products');
  const { token: { colorBgContainer, borderRadiusLG } } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div style={{ padding: '16px', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>
          SuperPOS
        </div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          mode="inline"
          onClick={({ key }) => setSelectedKey(key)}
          items={[
            { key: 'products', icon: <ShoppingOutlined />, label: 'Products' },
            { key: 'dashboard', icon: <BarChartOutlined />, label: 'Dashboard' },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer, paddingLeft: 24 }}>
          <h2 style={{ margin: 0 }}>
            {selectedKey === 'products' ? 'Products' : 'Dashboard'}
          </h2>
        </Header>
        <Content style={{ margin: '16px', padding: 24, background: colorBgContainer, borderRadius: borderRadiusLG }}>
          {selectedKey === 'products' ? <ProductsPage /> : <Dashboard />}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminApp;
