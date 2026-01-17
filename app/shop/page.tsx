'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Card,
  Typography,
  Space,
  Row,
  Col,
  Tag,
  Button,
  message,
  Spin,
} from 'antd';
import { BankOutlined, ReloadOutlined, SyncOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import DashboardLayout from '@/components/DashboardLayout';
import { syncStoreInfo, getStoreInfoList } from '@/lib/api/shop';
import type { Shop } from '@/lib/types/shop';

const { Title } = Typography;

export default function ShopPage() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [total, setTotal] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // 加载店铺列表
  const loadShops = async () => {
    setLoading(true);
    try {
      const response = await getStoreInfoList({
        page: currentPage,
        pageSize: pageSize,
      });
      setShops(response?.data?.list || []);
      setTotal(response?.data?.total || 0);
    } catch (error: any) {
      message.error(error.message || '加载店铺列表失败');
      setShops([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // 同步店铺信息
  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await syncStoreInfo();
      // 处理不同的响应结构
      const success = response.data?.success ?? response.success ?? false;
      const count = response.data?.count ?? response.count ?? 0;
      const msg = response.data?.message ?? response.message ?? '';
      
      if (success) {
        message.success(`同步成功，共同步 ${count} 条店铺信息`);
        // 同步成功后刷新列表
        await loadShops();
      } else {
        // 只有在真正失败时才显示错误提示
        if (msg) {
          message.warning(msg);
        } else {
          message.warning('同步完成，但未返回成功状态');
        }
      }
    } catch (error: any) {
      message.error(error.message || '同步店铺信息失败');
    } finally {
      setSyncing(false);
    }
  };

  // 处理分页变化
  const handleTableChange = (page: number, size: number) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  // 初始加载和分页变化时重新加载
  useEffect(() => {
    loadShops();
  }, [currentPage, pageSize]);

  // 格式化时间戳
  const formatTimestamp = (timestamp: number | string | null | undefined): string => {
    if (!timestamp) return '-';
    // 如果是字符串，转换为数字
    const timestampNum = typeof timestamp === 'string' ? parseInt(timestamp, 10) : timestamp;
    if (isNaN(timestampNum)) return '-';
    return new Date(timestampNum).toLocaleString('zh-CN', {
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
      NO_AUTH: 'orange',
    };
    return statusMap[status] || 'default';
  };

  // 表格列定义
  const columns: ColumnsType<Shop> = [
    {
      title: '店铺ID',
      dataIndex: 'shopId',
      key: 'shopId',
      width: 100,
      sorter: (a, b) => {
        const aId = typeof a.shopId === 'string' ? parseInt(a.shopId, 10) : a.shopId;
        const bId = typeof b.shopId === 'string' ? parseInt(b.shopId, 10) : b.shopId;
        return (isNaN(aId) ? 0 : aId) - (isNaN(bId) ? 0 : bId);
      },
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
      render: (status: string) => {
        const statusMap: Record<string, string> = {
          NORMAL: '正常',
          EXPIRED: '已过期',
          NO_AUTH: '未认证',
        };
        return (
          <Tag color={getAuthExpiredStatusColor(status)}>
            {statusMap[status] || status}
          </Tag>
        );
      },
    },
    {
      title: '货币',
      dataIndex: 'currency',
      key: 'currency',
      width: 100,
      render: (text: string | null) => text ? <Tag>{text}</Tag> : '-',
    },
    {
      title: '时区',
      dataIndex: 'timeZoneId',
      key: 'timeZoneId',
      width: 150,
      render: (text: string | null) => text || '-',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      key: 'createTime',
      width: 180,
      render: (timestamp: number | string | null) => formatTimestamp(timestamp),
      sorter: (a, b) => {
        const aTime = typeof a.createTime === 'string' ? parseInt(a.createTime, 10) : (a.createTime || 0);
        const bTime = typeof b.createTime === 'string' ? parseInt(b.createTime, 10) : (b.createTime || 0);
        return aTime - bTime;
      },
    },
    {
      title: '过期时间',
      dataIndex: 'expireTime',
      key: 'expireTime',
      width: 180,
      render: (timestamp: number | string | null) => formatTimestamp(timestamp),
      sorter: (a, b) => {
        const aTime = typeof a.expireTime === 'string' ? parseInt(a.expireTime, 10) : (a.expireTime || 0);
        const bTime = typeof b.expireTime === 'string' ? parseInt(b.expireTime, 10) : (b.expireTime || 0);
        return aTime - bTime;
      },
    },
  ];

  return (
    <DashboardLayout>
      <div>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          {/* 页面标题和操作栏 */}
          <Row justify="space-between" align="middle">
            <Col>
              <Space align="center">
                <BankOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>
                  商家店铺
                </Title>
              </Space>
            </Col>
            <Col>
              <Space>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={loadShops}
                  loading={loading}
                >
                  刷新
                </Button>
                <Button
                  type="primary"
                  icon={<SyncOutlined />}
                  onClick={handleSync}
                  loading={syncing}
                >
                  同步店铺信息
                </Button>
              </Space>
            </Col>
          </Row>

          {/* 数据表格 */}
          <Card>
            <Spin spinning={loading}>
              <Table
                columns={columns}
                dataSource={shops?.map((shop) => ({ ...shop, key: shop.shopId?.toString() || shop.id?.toString() || Math.random().toString() })) || []}
                scroll={{ x: 1200 }}
                pagination={{
                  current: currentPage,
                  pageSize: pageSize,
                  total: total,
                  showSizeChanger: true,
                  showTotal: (total) => `共 ${total} 条记录`,
                  pageSizeOptions: ['10', '20', '50', '100'],
                  onChange: handleTableChange,
                  onShowSizeChange: handleTableChange,
                }}
                bordered
                size="small"
              />
            </Spin>
          </Card>
        </Space>
      </div>
    </DashboardLayout>
  );
}
