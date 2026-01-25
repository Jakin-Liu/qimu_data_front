'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Badge,
  Pagination,
  Spin,
  Empty,
  message,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  GlobalOutlined,
  RiseOutlined,
  CopyOutlined,
  CheckOutlined,
  LinkOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';

const { Text, Title } = Typography;

interface SearchResult {
  id: number;
  task_id: string;
  task_url: string;
  influencer_name: string;
  influencer_followers: number;
  country_region: string;
  fastmoss_detail_url: string;
  product_sales_count: number;
  product_sales_amount: number;
  influencer_id: string;
  sale_amount_show: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export default function InfluencerSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [copiedItems, setCopiedItems] = useState<Set<number>>(new Set());
  const [copiedTaskIds, setCopiedTaskIds] = useState<Set<number>>(new Set());

  const handleSearch = useCallback(
    async (page = 1, showToast = true) => {
      if (!searchTerm.trim()) {
        if (showToast) {
          message.warning('请输入达人ID');
        }
        return;
      }

      setLoading(true);
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        
        const mockResults: SearchResult[] = [
          {
            id: 1,
            task_id: 'task-001',
            task_url: 'https://www.fastmoss.com/zh/e-commerce/detail/123456789',
            influencer_name: '测试达人',
            influencer_followers: 50000,
            country_region: '马来西亚',
            fastmoss_detail_url: 'https://www.fastmoss.com/influencer/123',
            product_sales_count: 1000,
            product_sales_amount: 50000,
            influencer_id: 'influencer-123',
            sale_amount_show: 'RM 50,000',
            status: 'active',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ];

        setSearchResults(mockResults);
        setPagination({
          page,
          limit: 10,
          total: mockResults.length,
          totalPages: 1,
        });

        if (showToast && mockResults.length > 0) {
          message.success(`找到 ${mockResults.length} 条数据`);
        }
      } catch (error) {
        if (showToast) {
          message.error('搜索失败');
        }
      } finally {
        setLoading(false);
      }
    },
    [searchTerm]
  );

  useEffect(() => {
    const loadAllData = async () => {
      setLoading(true);
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockResults: SearchResult[] = [];
        setSearchResults(mockResults);
        setPagination({
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0,
        });
      } catch (error) {
        console.error('加载数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAllData();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch(1, false);
      } else {
        const loadAllData = async () => {
          setLoading(true);
          try {
            await new Promise((resolve) => setTimeout(resolve, 500));
            setSearchResults([]);
            setPagination({
              page: 1,
              limit: 10,
              total: 0,
              totalPages: 0,
            });
          } catch (error) {
            console.error('加载数据失败:', error);
          } finally {
            setLoading(false);
          }
        };
        loadAllData();
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, handleSearch]);

  const handleCopy = async (text: string, itemId: number) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems((prev) => new Set([...prev, itemId]));
      message.success('复制成功');
      setTimeout(() => {
        setCopiedItems((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      message.error('复制失败');
    }
  };

  const handleCopyTaskId = async (taskId: string, itemId: number) => {
    try {
      await navigator.clipboard.writeText(taskId);
      setCopiedTaskIds((prev) => new Set([...prev, itemId]));
      message.success('复制成功');
      setTimeout(() => {
        setCopiedTaskIds((prev) => {
          const newSet = new Set(prev);
          newSet.delete(itemId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      message.error('复制失败');
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 10000) {
      return (num / 10000).toFixed(1) + '万';
    }
    return num.toLocaleString();
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 10000) {
      return 'RM' + (amount / 10000).toFixed(1) + '万';
    }
    return 'RM' + amount.toLocaleString();
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Card>
        <Space.Compact style={{ width: '100%', display: 'flex' }}>
          <Input
            placeholder="输入达人ID搜索，或留空查看所有数据..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={() => handleSearch(1, true)}
            allowClear
            size="large"
            style={{ flex: 1 }}
          />
          <Button
            type="primary"
            icon={<SearchOutlined />}
            onClick={() => handleSearch(1, true)}
            loading={loading}
            size="large"
            style={{ minWidth: 100 }}
          >
            搜索
          </Button>
        </Space.Compact>
      </Card>

      {searchResults.length > 0 && (
        <Card
          title={
            <Space>
              <span>
                {searchTerm.trim() ? `搜索结果: ${searchTerm}` : '所有数据'}
              </span>
              <Badge count={pagination.total} showZero />
            </Space>
          }
        >
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            {searchResults.map((item) => (
              <Card key={item.id} style={{ borderLeft: '4px solid #1890ff' }}>
                <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <div style={{ flex: 1, minWidth: 200 }}>
                      <Title level={5}>
                        <UserOutlined style={{ marginRight: 8 }} />
                        {item.influencer_name}
                      </Title>
                      <Space orientation="vertical" size="small">
                        <Text type="secondary" code>
                          ID: {item.influencer_id}
                        </Text>
                        <Button
                          type="text"
                          size="small"
                          icon={
                            copiedItems.has(item.id) ? (
                              <CheckOutlined style={{ color: '#52c41a' }} />
                            ) : (
                              <CopyOutlined />
                            )
                          }
                          onClick={() => handleCopy(item.influencer_id, item.id)}
                        />
                        <div>
                          <Space>
                            <TeamOutlined />
                            <Text>{formatNumber(item.influencer_followers)} 粉丝</Text>
                          </Space>
                          <Space style={{ marginLeft: 16 }}>
                            <EnvironmentOutlined />
                            <Text>{item.country_region}</Text>
                          </Space>
                        </div>
                      </Space>
                    </div>

                    <div style={{ flex: 1, minWidth: 200 }}>
                      <Title level={5}>
                        <RiseOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                        商品数据
                      </Title>
                      <Space orientation="vertical" size="small">
                        <div>
                          <Text type="secondary">销量: </Text>
                          <Text strong>{item.product_sales_count}</Text>
                        </div>
                        <div>
                          <Text type="secondary">销售额: </Text>
                          <Text strong>{formatCurrency(item.product_sales_amount)}</Text>
                        </div>
                        {item.sale_amount_show && (
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            原始显示: {item.sale_amount_show}
                          </Text>
                        )}
                      </Space>
                    </div>

                    <div style={{ flex: 1, minWidth: 200 }}>
                      <Title level={5}>
                        <GlobalOutlined style={{ marginRight: 8, color: '#722ed1' }} />
                        相关链接
                      </Title>
                      <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                        <Button
                          block
                          icon={<LinkOutlined />}
                          onClick={() => window.open(item.fastmoss_detail_url, '_blank')}
                        >
                          达人详情页
                        </Button>
                        <Button
                          block
                          icon={<LinkOutlined />}
                          onClick={() => window.open(item.task_url, '_blank')}
                        >
                          商品页面
                        </Button>
                      </Space>
                    </div>
                  </div>

                  <div
                    style={{
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Space>
                      <Text type="secondary">任务ID: </Text>
                      <Text code>{item.task_id}</Text>
                      <Button
                        type="text"
                        size="small"
                        icon={
                          copiedTaskIds.has(item.id) ? (
                            <CheckOutlined style={{ color: '#52c41a' }} />
                          ) : (
                            <CopyOutlined />
                          )
                        }
                        onClick={() => handleCopyTaskId(item.task_id, item.id)}
                      />
                    </Space>
                    <Badge
                      status={item.status === 'active' ? 'success' : 'default'}
                      text={item.status}
                    />
                    <Space>
                      <CalendarOutlined />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        创建时间: {new Date(item.created_at).toLocaleString('zh-CN')}
                      </Text>
                    </Space>
                  </div>
                </Space>
              </Card>
            ))}
          </Space>

          {pagination.totalPages > 1 && (
            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Pagination
                current={pagination.page}
                total={pagination.total}
                pageSize={pagination.limit}
                onChange={(page) => handleSearch(page, false)}
              />
            </div>
          )}
        </Card>
      )}

      {loading && (
        <Card>
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        </Card>
      )}

      {!loading && searchResults.length === 0 && searchTerm && (
        <Card>
          <Empty description="未找到相关数据" />
        </Card>
      )}
    </Space>
  );
}

