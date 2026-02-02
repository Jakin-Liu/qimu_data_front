'use client';

import { useState, useCallback } from 'react';
import {
  Card,
  Input,
  Button,
  Space,
  Typography,
  Tag,
  Pagination,
  Spin,
  Empty,
  message,
} from 'antd';
import {
  SearchOutlined,
  UserOutlined,
  RiseOutlined,
  CopyOutlined,
  CheckOutlined,
  LinkOutlined,
  CalendarOutlined,
  TeamOutlined,
  EnvironmentOutlined,
} from '@ant-design/icons';
import { post } from '@/lib/api';

const { Text, Title } = Typography;

// 国旗映射
const countryFlags: Record<string, string> = {
  'MY': '🇲🇾',
  'SG': '🇸🇬',
  'ID': '🇮🇩',
  'TH': '🇹🇭',
  'VN': '🇻🇳',
  'PH': '🇵🇭',
  'US': '🇺🇸',
  'UK': '🇬🇧',
  '马来西亚': '🇲🇾',
  '新加坡': '🇸🇬',
  '印尼': '🇮🇩',
  '泰国': '🇹🇭',
  '越南': '🇻🇳',
  '菲律宾': '🇵🇭',
  '美国': '🇺🇸',
  '英国': '🇬🇧',
};

// 列表项展示用（组件内部）
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

// API 返回的列表项（camelCase）
interface FastmossSearchItem {
  id: number;
  taskDefinitionId: string;
  taskInstanceId: string;
  taskUrl: string;
  influencerName: string;
  influencerFollowers: number;
  countryRegion: string;
  fastmossDetailUrl: string;
  productSalesCount: number;
  productSalesAmount: string;
  influencerId: string;
  saleAmountShow: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// API 响应结构
interface FastmossSearchResponse {
  data: {
    list: FastmossSearchItem[];
    total: number;
  };
  code: number;
  message: string;
}

function mapApiItemToResult(item: FastmossSearchItem): SearchResult {
  return {
    id: item.id,
    task_id: item.taskInstanceId,
    task_url: item.taskUrl,
    influencer_name: item.influencerName,
    influencer_followers: item.influencerFollowers,
    country_region: item.countryRegion,
    fastmoss_detail_url: item.fastmossDetailUrl,
    product_sales_count: item.productSalesCount,
    product_sales_amount: parseFloat(item.productSalesAmount) || 0,
    influencer_id: item.influencerId,
    sale_amount_show: item.saleAmountShow,
    status: item.status,
    created_at: item.createdAt,
    updated_at: item.updatedAt,
  };
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
        const res = await post<FastmossSearchResponse>('/fastmoss/search', {
          keyword: searchTerm.trim(),
          page,
          limit: 10,
        });
        if (res.code !== 0) {
          throw new Error(res.message || '搜索失败');
        }
        const list = res.data?.list ?? [];
        const total = res.data?.total ?? 0;
        const results: SearchResult[] = list.map(mapApiItemToResult);

        setSearchResults(results);
        setPagination({
          page,
          limit: 10,
          total,
          totalPages: Math.ceil(total / 10) || 0,
        });

        if (showToast) {
          if (results.length > 0) {
            message.success(`找到 ${total} 条数据`);
          } else {
            message.info('未找到相关达人');
          }
        }
      } catch (error: any) {
        if (showToast) {
          message.error(error?.message || '搜索失败');
        }
        setSearchResults([]);
        setPagination({ page: 1, limit: 10, total: 0, totalPages: 0 });
      } finally {
        setLoading(false);
      }
    },
    [searchTerm]
  );

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

  const getCountryFlag = (country: string) => {
    return countryFlags[country] || '🌍';
  };

  const formatCountryCode = (country: string) => {
    // 返回简短的国家代码
    const codeMap: Record<string, string> = {
      '马来西亚': 'MY',
      '新加坡': 'SG',
      '印尼': 'ID',
      '泰国': 'TH',
      '越南': 'VN',
      '菲律宾': 'PH',
      '美国': 'US',
      '英国': 'UK',
    };
    return codeMap[country] || country;
  };

  return (
    <div style={{ padding: '24px' }}>
      {/* 页面标题 */}
      <Title level={3} style={{ marginBottom: 24, fontWeight: 700 }}>
        TK带货达人数据检索
      </Title>

      {/* 搜索区域 */}
      <Card style={{ marginBottom: 24, borderRadius: 12 }}>
        <div style={{ marginBottom: 16 }}>
          <Space align="center">
            <SearchOutlined style={{ fontSize: 18 }} />
            <Text strong style={{ fontSize: 16 }}>数据检索</Text>
          </Space>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <Input
            placeholder="输入达人ID搜索..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onPressEnter={() => handleSearch(1, true)}
            allowClear
            size="large"
            style={{ flex: 1, borderRadius: 8 }}
          />
          <Button
            type="primary"
            onClick={() => handleSearch(1, true)}
            loading={loading}
            size="large"
            style={{ 
              minWidth: 80, 
              borderRadius: 8,
              backgroundColor: '#1a1a1a',
              borderColor: '#1a1a1a',
            }}
          >
            搜索
          </Button>
        </div>
      </Card>

      {/* 搜索结果 */}
      {(searchResults.length > 0 || searchTerm) && (
        <Card style={{ borderRadius: 12 }}>
          {/* 结果标题栏 */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: 20,
          }}>
            <Text strong style={{ fontSize: 16 }}>
              搜索结果: {searchTerm || '全部'}
            </Text>
            <Tag style={{ 
              backgroundColor: '#f5f5f5', 
              border: 'none',
              borderRadius: 4,
              padding: '4px 12px',
            }}>
              共 {pagination.total} 条记录
            </Tag>
          </div>

          {/* 结果列表 */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Spin size="large" />
            </div>
          ) : searchResults.length > 0 ? (
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              {searchResults.map((item) => (
                <Card 
                  key={item.id} 
                  style={{ 
                    borderRadius: 12,
                    borderLeft: '4px solid #1890ff',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                  }}
                  bodyStyle={{ padding: 20 }}
                >
                  {/* 主要内容区域 - 三列布局 */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(3, 1fr)', 
                    gap: 24,
                    marginBottom: 16,
                  }}>
                    {/* 达人信息 */}
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        marginBottom: 8,
                      }}>
                        <UserOutlined style={{ color: '#8c8c8c' }} />
                        <Text strong style={{ fontSize: 15 }}>
                          {item.influencer_name}
                        </Text>
                        <span style={{ fontSize: 16 }}>{getCountryFlag(item.country_region)}</span>
                        <Button
                          type="text"
                          size="small"
                          icon={
                            copiedItems.has(item.id) ? (
                              <CheckOutlined style={{ color: '#52c41a' }} />
                            ) : (
                              <CopyOutlined style={{ color: '#8c8c8c' }} />
                            )
                          }
                          onClick={() => handleCopy(item.influencer_name, item.id)}
                          style={{ padding: '0 4px' }}
                        />
                      </div>
                      <div style={{ marginBottom: 4 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          ID: {item.influencer_id}
                        </Text>
                      </div>
                      <div style={{ display: 'flex', gap: 16 }}>
                        <Space size={4}>
                          <TeamOutlined style={{ color: '#8c8c8c' }} />
                          <Text style={{ fontSize: 13 }}>
                            {formatNumber(item.influencer_followers)} 粉丝
                          </Text>
                        </Space>
                        <Space size={4}>
                          <EnvironmentOutlined style={{ color: '#8c8c8c' }} />
                          <Text style={{ fontSize: 13 }}>
                            {formatCountryCode(item.country_region)}
                          </Text>
                        </Space>
                      </div>
                    </div>

                    {/* 商品数据 */}
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        marginBottom: 8,
                      }}>
                        <RiseOutlined style={{ color: '#52c41a' }} />
                        <Text strong style={{ fontSize: 15 }}>商品数据</Text>
                      </div>
                      <div style={{ display: 'flex', gap: 24, marginBottom: 4 }}>
                        <div>
                          <Text type="secondary" style={{ fontSize: 13 }}>销量: </Text>
                          <Text strong style={{ fontSize: 13 }}>{item.product_sales_count}</Text>
                        </div>
                        <div>
                          <Text type="secondary" style={{ fontSize: 13 }}>销售额: </Text>
                          <Text strong style={{ fontSize: 13 }}>{formatCurrency(item.product_sales_amount)}</Text>
                        </div>
                      </div>
                      {item.sale_amount_show && (
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          原始显示: {item.sale_amount_show}
                        </Text>
                      )}
                    </div>

                    {/* 相关链接 */}
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 8,
                        marginBottom: 8,
                      }}>
                        <LinkOutlined style={{ color: '#1890ff' }} />
                        <Text strong style={{ fontSize: 15 }}>相关链接</Text>
                      </div>
                      <Space orientation="vertical" size="small" style={{ width: '100%' }}>
                        <Button
                          block
                          icon={<LinkOutlined />}
                          onClick={() => window.open(item.fastmoss_detail_url, '_blank')}
                          style={{ 
                            textAlign: 'left', 
                            borderRadius: 6,
                            justifyContent: 'flex-start',
                          }}
                        >
                          达人详情页
                        </Button>
                        <Button
                          block
                          icon={<LinkOutlined />}
                          onClick={() => window.open(item.task_url, '_blank')}
                          style={{ 
                            textAlign: 'left', 
                            borderRadius: 6,
                            justifyContent: 'flex-start',
                          }}
                        >
                          商品页面
                        </Button>
                      </Space>
                    </div>
                  </div>

                  {/* 底部信息栏 */}
                  <div
                    style={{
                      borderTop: '1px solid #f0f0f0',
                      paddingTop: 12,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <Space size="small">
                      <Text type="secondary" style={{ fontSize: 13 }}>任务ID:</Text>
                      <Text 
                        code 
                        style={{ 
                          fontSize: 12,
                          backgroundColor: '#f5f5f5',
                          padding: '2px 8px',
                          borderRadius: 4,
                        }}
                      >
                        {item.task_id}
                      </Text>
                      <Button
                        type="text"
                        size="small"
                        icon={
                          copiedTaskIds.has(item.id) ? (
                            <CheckOutlined style={{ color: '#52c41a' }} />
                          ) : (
                            <CopyOutlined style={{ color: '#8c8c8c' }} />
                          )
                        }
                        onClick={() => handleCopyTaskId(item.task_id, item.id)}
                        style={{ padding: '0 4px' }}
                      />
                    </Space>
                    <Space>
                      <CalendarOutlined style={{ color: '#8c8c8c' }} />
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        创建时间: {new Date(item.created_at).toLocaleString('zh-CN')}
                      </Text>
                    </Space>
                    <Tag
                      style={{
                        backgroundColor: item.status === 'active' ? '#1a1a1a' : '#d9d9d9',
                        color: item.status === 'active' ? '#fff' : '#666',
                        border: 'none',
                        borderRadius: 4,
                        padding: '2px 12px',
                        fontSize: 12,
                      }}
                    >
                      {item.status}
                    </Tag>
                  </div>
                </Card>
              ))}
            </Space>
          ) : (
            <Empty description="未找到相关数据" />
          )}

          {/* 分页 */}
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

      {/* 初始状态（无搜索词时） */}
      {!loading && !searchTerm && searchResults.length === 0 && (
        <Card style={{ borderRadius: 12 }}>
          <Empty description="请输入达人ID进行搜索" />
        </Card>
      )}
    </div>
  );
}

