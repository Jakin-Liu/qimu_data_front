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
} from 'antd';
import { BankOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DashboardLayout from '@/components/DashboardLayout';

const { Title } = Typography;

// 商家店铺数据类型
interface ShopData {
  key: string;
  shopId: number;
  name: string;
  platform: string;
  status: string;
  authExpiredStatus: string;
  currency: string;
  timeZoneId: string;
  createTime: number;
  expireTime: number;
  isDeleted: number;
}

// 模拟数据
const shopData: ShopData[] = [
  {
    key: '1',
    shopId: 30598,
    name: 'CS355',
    platform: 'INDEPENDENT',
    status: 'UNLOCK',
    authExpiredStatus: 'NORMAL',
    currency: 'IDR',
    timeZoneId: 'Asia/Jakarta',
    createTime: 1756867627000,
    expireTime: 2114352000000,
    isDeleted: 0,
  },
  {
    key: '2',
    shopId: 30599,
    name: 'CS356',
    platform: 'SHOPEE',
    status: 'LOCK',
    authExpiredStatus: 'EXPIRED',
    currency: 'THB',
    timeZoneId: 'Asia/Bangkok',
    createTime: 1756867628000,
    expireTime: 2114352001000,
    isDeleted: 0,
  },
  {
    key: '3',
    shopId: 30600,
    name: 'CS357',
    platform: 'LAZADA',
    status: 'UNLOCK',
    authExpiredStatus: 'NORMAL',
    currency: 'SGD',
    timeZoneId: 'Asia/Singapore',
    createTime: 1756867629000,
    expireTime: 2114352002000,
    isDeleted: 0,
  },
];

// 格式化时间戳
const formatTimestamp = (timestamp: number): string => {
  if (!timestamp) return '-';
  return new Date(timestamp).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

// 状态标签颜色
const getStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    UNLOCK: 'green',
    LOCK: 'red',
  };
  return statusMap[status] || 'default';
};

// 认证过期状态标签颜色
const getAuthExpiredStatusColor = (status: string): string => {
  const statusMap: Record<string, string> = {
    NORMAL: 'green',
    EXPIRED: 'red',
  };
  return statusMap[status] || 'default';
};

export default function ShopPage() {
  // 表格列定义
  const columns: ColumnsType<ShopData> = [
    {
      title: '店铺ID',
      dataIndex: 'shopId',
      key: 'shopId',
      width: 100,
      sorter: (a, b) => a.shopId - b.shopId,
    },
    {
      title: '店铺名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    },
    {
      title: '平台',
      dataIndex: 'platform',
      key: 'platform',
      width: 120,
      render: (text: string) => (
        <Tag color="blue">{text}</Tag>
      ),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status === 'UNLOCK' ? '解锁' : '锁定'}
        </Tag>
      ),
    },
    {
      title: '认证过期状态',
      dataIndex: 'authExpiredStatus',
      key: 'authExpiredStatus',
      width: 130,
      render: (status: string) => (
        <Tag color={getAuthExpiredStatusColor(status)}>
          {status === 'NORMAL' ? '正常' : status === 'EXPIRED' ? '已过期' : status}
        </Tag>
      ),
    },
    {
      title: '货币',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
      render: (text: string) => (
        <Tag>{text}</Tag>
      ),
    },
    {
      title: '时区',
      dataIndex: 'timeZoneId',
      key: 'timeZoneId',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (timestamp: number) => formatTimestamp(timestamp),
      sorter: (a, b) => a.createTime - b.createTime,
    },
    {
      title: '过期时间',
      dataIndex: 'expireTime',
      key: 'expireTime',
      width: 180,
      render: (timestamp: number) => formatTimestamp(timestamp),
      sorter: (a, b) => a.expireTime - b.expireTime,
    },
    {
      title: '是否删除',
      dataIndex: 'isDeleted',
      key: 'isDeleted',
      width: 100,
      render: (value: number) => (
        <Tag color={value === 0 ? 'green' : 'red'}>
          {value === 0 ? '否' : '是'}
        </Tag>
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
                <BankOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>
                  商家店铺
                </Title>
              </Space>
            </Col>
          </Row>

          {/* 数据表格 */}
          <Card>
            <Table
              columns={columns}
              dataSource={shopData}
              scroll={{ x: 1200 }}
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

