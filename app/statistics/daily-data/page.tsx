'use client';

import { Card, Typography, Space, Row, Col } from 'antd';
import { CalendarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { Table } from 'antd';
import DashboardLayout from '@/components/DashboardLayout';
import { dailyData, type DailyData } from '../data';
import { formatBaht, formatRMB, formatPercent } from '../utils';

const { Title } = Typography;

export default function DailyDataPage() {
  // 日数据的列定义
  const columns: ColumnsType<DailyData> = [
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 100,
      fixed: 'left',
      render: (text: string) => text || '-',
    },
    {
      title: '店铺',
      dataIndex: 'shop',
      key: 'shop',
      width: 150,
      fixed: 'left',
      render: (text: string, record: DailyData) => (
        <span
          style={{
            fontWeight: record.isSummary ? 'bold' : 'normal',
            color: record.isSummary ? '#1890ff' : 'inherit',
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: '周',
      dataIndex: 'week',
      key: 'week',
      width: 120,
      render: (text: string) => text || '-',
    },
    {
      title: '日期',
      dataIndex: 'date',
      key: 'date',
      width: 100,
      render: (text: string) => text || '-',
    },
    {
      title: '营销费用/฿',
      dataIndex: 'marketingCost',
      key: 'marketingCost',
      width: 130,
      align: 'right',
      render: (value: number | null, record: DailyData) => {
        if (record.shop === '汇总-RMB') {
          return formatRMB(value);
        }
        return formatBaht(value);
      },
    },
    {
      title: '订单数',
      dataIndex: 'orderCount',
      key: 'orderCount',
      width: 100,
      align: 'right',
      render: (value: number | null) => (value === null ? '-' : value),
    },
    {
      title: '销售额/฿',
      dataIndex: 'salesAmount',
      key: 'salesAmount',
      width: 130,
      align: 'right',
      render: (value: number | null, record: DailyData) => {
        if (value === null) return '-';
        if (record.shop === '汇总-RMB') {
          return formatRMB(value);
        }
        return formatBaht(value);
      },
    },
    {
      title: '营销占比',
      dataIndex: 'marketingShare',
      key: 'marketingShare',
      width: 100,
      align: 'right',
      render: (value: number | null) => (value === null ? '-' : formatPercent(value)),
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
                <CalendarOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>
                  每日销售数据
                </Title>
              </Space>
            </Col>
          </Row>

          {/* 数据表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={dailyData}
              scroll={{ x: 1000 }}
              pagination={{
                showSizeChanger: true,
                showTotal: (total) => `共 ${total} 条记录`,
                pageSizeOptions: ['10', '20', '50', '100'],
                defaultPageSize: 20,
              }}
              rowClassName={(record: DailyData) => {
                if (record.isSummary) {
                  return 'summary-row';
                }
                return '';
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

