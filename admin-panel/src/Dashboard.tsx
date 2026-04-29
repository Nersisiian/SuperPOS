import React, { useEffect, useState } from 'react';
import { Card, Col, Row, Statistic, Table } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import axios from 'axios';

const Dashboard = () => {
  const [summary, setSummary] = useState({ todaySales: 0, todayOrders: 0, weekSales: 0, weekOrders: 0 });
  const [dailyData, setDailyData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, dailyRes, topRes] = await Promise.all([
          axios.get('/api/reports/summary'),
          axios.get('/api/reports/daily-sales?days=7'),
          axios.get('/api/reports/top-products?days=30&limit=10'),
        ]);
        setSummary(sumRes.data);
        setDailyData(dailyRes.data.map((d: any) => ({ date: d.date, total: d.total })));
        setTopProducts(topRes.data.map((p: any) => ({ key: p.barcode, ...p })));
      } catch (e) {
        console.error('Failed to load reports', e);
      }
    };
    fetchData();
  }, []);

  const topColumns = [
    { title: 'Barcode', dataIndex: 'barcode' },
    { title: 'Name', dataIndex: 'name' },
    { title: 'Sold', dataIndex: 'sold' },
  ];

  return (
    <div>
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card><Statistic title="Today Sales" value={summary.todaySales} precision={2} prefix="$" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Today Orders" value={summary.todayOrders} /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Week Sales" value={summary.weekSales} precision={2} prefix="$" /></Card>
        </Col>
        <Col span={6}>
          <Card><Statistic title="Week Orders" value={summary.weekOrders} /></Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Daily Sales (7 days)">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#8884d8" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Top Products (30 days)">
            <Table
              dataSource={topProducts}
              columns={topColumns}
              pagination={false}
              size="small"
              scroll={{ y: 240 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
