'use client';

import { Card, Typography, Space, Row, Col } from 'antd';
import { ShoppingCartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import { productCartData, type ProductCartData } from '../data';
import { formatCurrency, formatPercent } from '../utils';

const { Title } = Typography;

export default function ProductCartPage() {
  // 产品加购数据的列定义
  const columns: ColumnsType<ProductCartData> = [
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 120,
    },
    {
      title: '访客数',
      dataIndex: 'visitorCount',
      key: 'visitorCount',
      width: 100,
      align: 'right',
    },
    {
      title: '加入购物车',
      dataIndex: 'addToCart',
      key: 'addToCart',
      width: 120,
      align: 'right',
    },
    {
      title: '加购率',
      dataIndex: 'addToCartRate',
      key: 'addToCartRate',
      width: 100,
      align: 'right',
      render: (value: number) => formatPercent(value),
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right',
    },
    {
      title: '加购到下单转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 150,
      align: 'right',
      render: (value: number) => formatPercent(value),
    },
    {
      title: '销售额',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          {/* 页面标题 */}
          <Row align="middle">
            <Col>
              <Space align="center">
                <ShoppingCartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>
                  产品加购数据
                </Title>
              </Space>
            </Col>
          </Row>

          {/* 数据表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={productCartData}
              scroll={{ x: 800 }}
              pagination={{
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
                pageSizeOptions: ['10', '20', '50', '100'],
                defaultPageSize: 10,
              }}
              bordered
              size="small"
            />
          </Card>
        </Space>
      </div>
    </DashboardLayout>
  );
}

