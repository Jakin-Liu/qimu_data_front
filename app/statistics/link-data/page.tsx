'use client';

import { Card, Typography, Space, Row, Col } from 'antd';
import { LinkOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import { linkData, type LinkData } from '../data';
import { formatCurrency, formatPercent } from '../utils';

const { Title } = Typography;

export default function LinkDataPage() {
  // 链接数据统计的列定义
  const columns: ColumnsType<LinkData> = [
    {
      title: '链接名称',
      dataIndex: 'linkName',
      key: 'linkName',
      width: 150,
    },
    {
      title: '访客数',
      dataIndex: 'visitorCount',
      key: 'visitorCount',
      width: 100,
      align: 'right',
    },
    {
      title: '点击数',
      dataIndex: 'clickCount',
      key: 'clickCount',
      width: 100,
      align: 'right',
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right',
    },
    {
      title: '销售额',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 120,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: '转化率',
      dataIndex: 'conversionRate',
      key: 'conversionRate',
      width: 100,
      align: 'right',
      render: (value: number) => formatPercent(value),
    },
    {
      title: '客单价',
      dataIndex: 'avgOrderValue',
      key: 'avgOrderValue',
      width: 100,
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
                <LinkOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>
                  链接数据统计
                </Title>
              </Space>
            </Col>
          </Row>

          {/* 数据表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={linkData}
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

