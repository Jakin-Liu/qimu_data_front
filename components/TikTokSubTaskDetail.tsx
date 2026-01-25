'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  Button,
  Badge,
  Space,
  Typography,
  Pagination,
  Spin,
  Empty,
  message,
  Image,
  Row,
  Col,
} from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  MessageOutlined,
  GlobalOutlined,
  StarFilled,
  CheckOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { Review, SubTask } from '@/lib/types/tiktok-review';

const { Title, Text, Paragraph } = Typography;

interface TikTokSubTaskDetailProps {
  subTaskId: string;
  taskId: string;
  onBack: () => void;
}

export default function TikTokSubTaskDetail({
  subTaskId,
  taskId,
  onBack,
}: TikTokSubTaskDetailProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [subTask, setSubTask] = useState<SubTask | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  const fetchReviews = async (page = 1, showToast = false) => {
    try {
      setIsLoading(true);
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockReviews: Review[] = [
        {
          id: 1,
          subTaskId,
          taskId,
          reviewId: 'review-001',
          productId: '1730584769274152937',
          reviewerName: '测试用户',
          reviewerAvatarUrl: '',
          reviewRating: 5,
          reviewText: '这个产品非常好用，强烈推荐！',
          reviewImages: [],
          reviewTime: Date.now(),
          reviewCountry: '马来西亚',
          isVerifiedPurchase: true,
          isIncentivizedReview: false,
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const mockSubTask: SubTask = {
        id: subTaskId,
        taskId,
        url: 'https://shop.tiktok.com/view/product/1730584769274152937',
        productId: '1730584769274152937',
        status: 'completed',
        currentPage: 10,
        totalPages: 10,
        totalReviews: 100,
        startedAt: new Date(Date.now() - 7200000).toISOString(),
        completedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setReviews(mockReviews);
      setSubTask(mockSubTask);
      setPagination({
        page,
        limit: 20,
        total: 100,
        totalPages: 5,
      });

      if (showToast) {
        message.success('刷新成功');
      }
    } catch (error) {
      message.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews(1);
  }, [subTaskId]);

  const formatReviewTime = (review: Review) => {
    if (review.reviewTimeParsed) {
      return new Date(review.reviewTimeParsed).toLocaleString('zh-CN');
    } else if (review.reviewTime) {
      const timestamp =
        typeof review.reviewTime === 'string'
          ? parseInt(review.reviewTime)
          : review.reviewTime;
      if (!isNaN(timestamp) && timestamp > 0) {
        return new Date(timestamp).toLocaleString('zh-CN');
      }
    }
    return '未知时间';
  };

  const handleDownloadCSV = async () => {
    try {
      message.success('CSV文件已下载');
    } catch (error) {
      message.error('下载失败');
    }
  };

  const renderStars = (rating?: number) => {
    if (!rating) return null;
    return (
      <Space>
        {Array.from({ length: 5 }).map((_, i) => (
          <StarFilled
            key={i}
            style={{
              color: i < rating ? '#faad14' : '#d9d9d9',
              fontSize: 16,
            }}
          />
        ))}
        <Text type="secondary">({rating})</Text>
      </Space>
    );
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            返回任务详情
          </Button>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              子任务评论详情
            </Title>
            <Text type="secondary" code>
              子任务ID: {subTaskId}
            </Text>
          </div>
        </Space>
        <Space>
          {subTask && subTask.status === 'completed' && (
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleDownloadCSV}
            >
              下载CSV
            </Button>
          )}
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchReviews(pagination.page, true)}
          >
            刷新
          </Button>
        </Space>
      </div>

      {subTask && (
        <Card
          title={
            <Space>
              <MessageOutlined />
              <span>子任务信息</span>
            </Space>
          }
        >
          <Row gutter={16}>
            <Col xs={24} sm={8}>
              <div>
                <Text type="secondary">商品URL</Text>
                <div style={{ marginTop: 4 }}>
                  <a
                    href={subTask.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    查看商品页面
                  </a>
                </div>
              </div>
            </Col>
            {subTask.productId && (
              <Col xs={24} sm={8}>
                <div>
                  <Text type="secondary">商品ID</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text strong>{subTask.productId}</Text>
                  </div>
                </div>
              </Col>
            )}
            <Col xs={24} sm={8}>
              <div>
                <Text type="secondary">总评论数</Text>
                <div style={{ marginTop: 4 }}>
                  <Text strong>{subTask.totalReviews}</Text>
                </div>
              </div>
            </Col>
          </Row>
        </Card>
      )}

      <Card
        title={
          <Space>
            <MessageOutlined />
            <span>评论列表</span>
          </Space>
        }
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        ) : reviews.length === 0 ? (
          <Empty description="暂无评论数据" />
        ) : (
          <>
            <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  style={{ borderLeft: '4px solid #1890ff' }}
                >
                  <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <Space align="start">
                          {review.reviewerAvatarUrl && (
                            <Image
                              src={review.reviewerAvatarUrl}
                              alt={review.reviewerName || '用户头像'}
                              width={40}
                              height={40}
                              style={{ borderRadius: '50%' }}
                              fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Crect fill='%23d9d9d9' width='40' height='40'/%3E%3C/svg%3E"
                            />
                          )}
                          <div style={{ flex: 1 }}>
                            <Space align="center" wrap style={{ marginBottom: 8 }}>
                              <Text strong>
                                {review.reviewerName || '匿名用户'}
                              </Text>
                              {review.isVerifiedPurchase && (
                                <Badge
                                  count="已验证购买"
                                  style={{ backgroundColor: '#52c41a' }}
                                />
                              )}
                              {review.isIncentivizedReview && (
                                <Badge
                                  count="激励评论"
                                  style={{ backgroundColor: '#faad14' }}
                                />
                              )}
                              {review.reviewCountry && (
                                <Badge
                                  count={
                                    <Space>
                                      <GlobalOutlined />
                                      {review.reviewCountry}
                                    </Space>
                                  }
                                  style={{ backgroundColor: '#1890ff' }}
                                />
                              )}
                            </Space>
                            {renderStars(review.reviewRating)}
                            <div style={{ marginTop: 4 }}>
                              <Space>
                                <ClockCircleOutlined />
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {formatReviewTime(review)}
                                </Text>
                              </Space>
                            </div>
                          </div>
                        </Space>
                      </div>
                      {review.reviewId && (
                        <Badge
                          count={`ID: ${review.reviewId}`}
                          style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                        />
                      )}
                    </div>

                    {review.reviewText && (
                      <div>
                        <Paragraph style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {review.reviewText}
                        </Paragraph>
                      </div>
                    )}

                    {review.skuSpecification && (
                      <div
                        style={{
                          background: '#f5f5f5',
                          padding: 12,
                          borderRadius: 4,
                        }}
                      >
                        <Text type="secondary" style={{ fontSize: 12 }}>
                          规格: {review.skuSpecification}
                        </Text>
                      </div>
                    )}

                    {review.reviewImages && review.reviewImages.length > 0 && (
                      <div>
                        <Text type="secondary" style={{ fontSize: 12, display: 'block', marginBottom: 8 }}>
                          评论图片 ({review.reviewImages.length})
                        </Text>
                        <Image.PreviewGroup>
                          <Row gutter={8}>
                            {review.reviewImages.map((img, idx) => (
                              <Col key={idx} xs={12} sm={8} md={6}>
                                <Image
                                  src={img}
                                  alt={`评论图片 ${idx + 1}`}
                                  style={{
                                    width: '100%',
                                    borderRadius: 4,
                                    cursor: 'pointer',
                                  }}
                                  fallback="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23d9d9d9' width='100' height='100'/%3E%3C/svg%3E"
                                />
                              </Col>
                            ))}
                          </Row>
                        </Image.PreviewGroup>
                      </div>
                    )}
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
                  onChange={(page) => fetchReviews(page)}
                />
              </div>
            )}
          </>
        )}
      </Card>
    </Space>
  );
}

