'use client';

import { useState } from 'react';
import {
  Table,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Tag,
  Statistic,
} from 'antd';
import { BarChartOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DashboardLayout from '@/components/DashboardLayout';
import { marketIncomeData, type StatisticsData } from '../data';
import { formatCurrency, formatPercent, formatNumber } from '../utils';

const { Title } = Typography;

export default function MarketIncomePage() {
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

  // 计算汇总数据
  const totalData = {
    visitorCount: marketIncomeData.filter(d => d.productName === '合计').reduce((sum, d) => sum + d.visitorCount, 0),
    salesAmount: marketIncomeData.filter(d => d.productName === '合计').reduce((sum, d) => sum + d.salesAmount, 0),
    orderCount: marketIncomeData.filter(d => d.productName === '合计').reduce((sum, d) => sum + d.orderCount, 0),
    marketGrossProfit: marketIncomeData.filter(d => d.productName === '合计').reduce((sum, d) => sum + d.marketGrossProfit, 0),
  };

  // 表格列定义（简化版，包含主要列）
  const columns: ColumnsType<StatisticsData> = [
    {
      title: '周',
      dataIndex: 'week',
      key: 'week',
      width: 120,
      fixed: 'left',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      fixed: 'left',
    },
    {
      title: '产品名称',
      dataIndex: 'productName',
      key: 'productName',
      width: 100,
      fixed: 'left',
      render: (text: string) => (
        <Tag color={text === '合计' ? 'blue' : 'default'}>{text}</Tag>
      ),
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
      width: 110,
      align: 'right',
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 90,
      align: 'right',
    },
    {
      title: '销售额',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 100,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: '产品毛利润',
      dataIndex: 'productGrossProfit',
      key: 'productGrossProfit',
      width: 110,
      align: 'right',
      render: (value: number) => (
        <span style={{ color: value < 0 ? '#ff4d4f' : '#52c41a' }}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      title: '产品毛利润率',
      dataIndex: 'productGrossProfitMargin',
      key: 'productGrossProfitMargin',
      width: 130,
      align: 'right',
      render: (value: number) => (
        <span style={{ color: value < 0 ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
          {formatPercent(value)}
        </span>
      ),
    },
    {
      title: '营销成本',
      dataIndex: 'marketingCost',
      key: 'marketingCost',
      width: 100,
      align: 'right',
      render: (value: number) => formatCurrency(value),
    },
    {
      title: '市场毛利润',
      dataIndex: 'marketGrossProfit',
      key: 'marketGrossProfit',
      width: 110,
      align: 'right',
      render: (value: number) => (
        <span style={{ color: value < 0 ? '#ff4d4f' : '#52c41a' }}>
          {formatCurrency(value)}
        </span>
      ),
    },
    {
      title: '市场毛利润率',
      dataIndex: 'marketGrossProfitMargin',
      key: 'marketGrossProfitMargin',
      width: 130,
      align: 'right',
      render: (value: number) => (
        <span style={{ color: value < 0 ? '#ff4d4f' : '#52c41a', fontWeight: 'bold' }}>
          {formatPercent(value)}
        </span>
      ),
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
                <BarChartOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>
                  市场收入统计
                </Title>
              </Space>
            </Col>
          </Row>

          {/* 统计卡片 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总访客数"
                  value={totalData.visitorCount}
                  styles={{ content: { color: '#1890ff' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总销售额"
                  value={totalData.salesAmount}
                  prefix="¥"
                  precision={2}
                  styles={{ content: { color: '#52c41a' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="总订单数"
                  value={totalData.orderCount}
                  styles={{ content: { color: '#722ed1' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="市场毛利润"
                  value={totalData.marketGrossProfit}
                  prefix="¥"
                  precision={2}
                  styles={{
                    content: {
                      color: totalData.marketGrossProfit >= 0 ? '#52c41a' : '#ff4d4f',
                    },
                  }}
                />
              </Card>
            </Col>
          </Row>

          {/* 数据表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={marketIncomeData}
              scroll={{ x: 1500, y: 600 }}
              pagination={{
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
                pageSizeOptions: ['10', '20', '50', '100'],
                defaultPageSize: 20,
              }}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
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

