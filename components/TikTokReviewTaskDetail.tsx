'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Badge,
  Space,
  Typography,
  Progress,
  Row,
  Col,
  Statistic,
  message,
  Spin,
} from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MessageOutlined,
  AimOutlined,
  CopyOutlined,
  CheckOutlined,
  LinkOutlined,
  DownloadOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { SubTask, TaskSummary } from '@/lib/types/tiktok-review';

const { Title, Text } = Typography;

interface TikTokReviewTaskDetailProps {
  taskId: string;
  onBack: () => void;
}

export default function TikTokReviewTaskDetail({
  taskId,
  onBack,
}: TikTokReviewTaskDetailProps) {
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [summary, setSummary] = useState<TaskSummary | null>(null);
  const [taskInfo, setTaskInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUrls, setCopiedUrls] = useState<Set<string>>(new Set());
  const router = useRouter();

  const fetchData = async (showSuccessToast = false) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      const mockSubTasks: SubTask[] = [
        {
          id: 'subtask-001',
          taskId,
          url: 'https://shop.tiktok.com/view/product/1730584769274152937',
          productId: '1730584769274152937',
          status: 'processing',
          currentPage: 5,
          totalPages: 10,
          totalReviews: 50,
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 'subtask-002',
          taskId,
          url: 'https://shop.tiktok.com/view/product/1234567890123456789',
          productId: '1234567890123456789',
          status: 'completed',
          currentPage: 10,
          totalPages: 10,
          totalReviews: 100,
          startedAt: new Date(Date.now() - 7200000).toISOString(),
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const mockSummary: TaskSummary = {
        totalSubTasks: 2,
        completedSubTasks: 1,
        failedSubTasks: 0,
        processingSubTasks: 1,
        pendingSubTasks: 0,
        totalReviews: 150,
        completionRate: 50,
      };

      const mockTaskInfo = {
        id: taskId,
        status: 'processing',
        createdAt: new Date().toISOString(),
        remark: '测试TK评论任务',
      };

      setSubTasks(mockSubTasks);
      setSummary(mockSummary);
      setTaskInfo(mockTaskInfo);

      if (showSuccessToast) {
        message.success('刷新成功');
      }
    } catch (error) {
      message.error('加载失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

  const getStatusConfig = (status: SubTask['status']) => {
    switch (status) {
      case 'pending':
        return {
          icon: <ClockCircleOutlined />,
          color: 'default',
          text: '等待中',
        };
      case 'processing':
        return {
          icon: <LoadingOutlined spin />,
          color: 'processing',
          text: '处理中',
        };
      case 'completed':
        return {
          icon: <CheckCircleOutlined />,
          color: 'success',
          text: '已完成',
        };
      case 'failed':
        return {
          icon: <CloseCircleOutlined />,
          color: 'error',
          text: '失败',
        };
    }
  };

  const handleCopyUrl = async (url: string, subTaskId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls((prev) => new Set(prev).add(subTaskId));
      message.success('URL已复制到剪贴板');
      setTimeout(() => {
        setCopiedUrls((prev) => {
          const newSet = new Set(prev);
          newSet.delete(subTaskId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      message.error('无法复制URL到剪贴板');
    }
  };

  const handleDownloadCSV = async (subTaskId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      message.success('CSV文件已下载');
    } catch (error) {
      message.error('下载失败');
    }
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <Spin size="large" />
      </div>
    );
  }

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
            返回任务列表
          </Button>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              任务详情
            </Title>
            <Text type="secondary" code>
              任务ID: {taskId}
            </Text>
          </div>
        </Space>
        <Button icon={<ReloadOutlined />} onClick={() => fetchData(true)}>
          刷新数据
        </Button>
      </div>

      {taskInfo && (
        <Card
          title={
            <Space>
              <MessageOutlined />
              <span>任务信息</span>
            </Space>
          }
        >
          <Row gutter={16}>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text type="secondary">状态</Text>
                <div style={{ marginTop: 4 }}>
                  <Badge
                    status={
                      taskInfo.status === 'completed'
                        ? 'success'
                        : taskInfo.status === 'processing'
                        ? 'processing'
                        : 'default'
                    }
                    text={
                      taskInfo.status === 'completed'
                        ? '已完成'
                        : taskInfo.status === 'processing'
                        ? '处理中'
                        : '等待中'
                    }
                  />
                </div>
              </div>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <div>
                <Text type="secondary">创建时间</Text>
                <div style={{ marginTop: 4 }}>
                  <Text>
                    {new Date(taskInfo.createdAt).toLocaleString('zh-CN')}
                  </Text>
                </div>
              </div>
            </Col>
            {taskInfo.completedAt && (
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary">完成时间</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text>
                      {new Date(taskInfo.completedAt).toLocaleString('zh-CN')}
                    </Text>
                  </div>
                </div>
              </Col>
            )}
            {taskInfo.remark && (
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text type="secondary">备注</Text>
                  <div style={{ marginTop: 4 }}>
                    <Text>{taskInfo.remark}</Text>
                  </div>
                </div>
              </Col>
            )}
          </Row>
        </Card>
      )}

      {summary && (
        <Row gutter={16}>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="总子任务数" value={summary.totalSubTasks} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="已完成"
                value={summary.completedSubTasks}
                styles={{ content: { color: '#52c41a' } }}
              />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic title="总评论数" value={summary.totalReviews} />
            </Card>
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Card>
              <Statistic
                title="完成率"
                value={summary.completionRate.toFixed(1)}
                suffix="%"
              />
              <Progress
                percent={summary.completionRate}
                style={{ marginTop: 8 }}
              />
            </Card>
          </Col>
        </Row>
      )}

      <Card
        title={
          <Space>
            <AimOutlined />
            <span>子任务列表</span>
          </Space>
        }
      >
        {subTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Text type="secondary">暂无子任务</Text>
          </div>
        ) : (
          <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
            {subTasks.map((subTask) => {
              const statusConfig = getStatusConfig(subTask.status);
              return (
                <Card
                  key={subTask.id}
                  hoverable
                  onClick={() => router.push(`/tiktok-reviews/${taskId}/${subTask.id}`)}
                  style={{ borderLeft: '4px solid #1890ff', cursor: 'pointer' }}
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
                        <Space align="start" style={{ marginBottom: 12 }} wrap>
                          <Badge
                            status={statusConfig.color as any}
                            text={statusConfig.text}
                          />
                          {subTask.productId && (
                            <Badge
                              count={`商品ID: ${subTask.productId}`}
                              style={{ backgroundColor: '#f0f0f0', color: '#000' }}
                            />
                          )}
                          <Badge
                            count={`${subTask.totalReviews || 0} 条评论`}
                            style={{ backgroundColor: '#1890ff' }}
                          />
                          {subTask.status === 'completed' && (
                            <Button
                              size="small"
                              icon={<DownloadOutlined />}
                              onClick={(e) => handleDownloadCSV(subTask.id, e)}
                            >
                              下载CSV
                            </Button>
                          )}
                        </Space>
                        <div style={{ marginTop: 8 }}>
                          <Space>
                            <Text type="secondary">URL:</Text>
                            <a
                              href={subTask.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {subTask.url}
                            </a>
                            <Button
                              type="text"
                              size="small"
                              icon={
                                copiedUrls.has(subTask.id) ? (
                                  <CheckOutlined style={{ color: '#52c41a' }} />
                                ) : (
                                  <CopyOutlined />
                                )
                              }
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCopyUrl(subTask.url, subTask.id);
                              }}
                            />
                          </Space>
                        </div>
                      </div>
                    </div>

                    <Row gutter={16}>
                      <Col xs={24} sm={12} md={6}>
                        <div>
                          <Text type="secondary">当前页数</Text>
                          <div>
                            <Text strong>
                              {subTask.currentPage} / {subTask.totalPages || '?'}
                            </Text>
                          </div>
                        </div>
                      </Col>
                      <Col xs={24} sm={12} md={6}>
                        <div>
                          <Text type="secondary">已抓取评论</Text>
                          <div>
                            <Text strong>{subTask.totalReviews}</Text>
                          </div>
                        </div>
                      </Col>
                      {subTask.startedAt && (
                        <Col xs={24} sm={12} md={6}>
                          <div>
                            <Text type="secondary">开始时间</Text>
                            <div>
                              <Text>
                                {new Date(subTask.startedAt).toLocaleString('zh-CN')}
                              </Text>
                            </div>
                          </div>
                        </Col>
                      )}
                      {subTask.completedAt && (
                        <Col xs={24} sm={12} md={6}>
                          <div>
                            <Text type="secondary">完成时间</Text>
                            <div>
                              <Text>
                                {new Date(subTask.completedAt).toLocaleString('zh-CN')}
                              </Text>
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>

                    {subTask.status === 'processing' && subTask.totalPages > 0 && (
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                          }}
                        >
                          <Text type="secondary">抓取进度</Text>
                          <Text strong>
                            {subTask.currentPage} / {subTask.totalPages} 页
                          </Text>
                        </div>
                        <Progress
                          percent={(subTask.currentPage / subTask.totalPages) * 100}
                        />
                      </div>
                    )}

                    {subTask.status === 'failed' && subTask.errorMessage && (
                      <div
                        style={{
                          background: '#fff1f0',
                          border: '1px solid #ffccc7',
                          borderRadius: 4,
                          padding: 12,
                        }}
                      >
                        <Space align="start">
                          <ExclamationCircleOutlined style={{ color: '#ff4d4f' }} />
                          <div>
                            <Text strong style={{ color: '#ff4d4f', display: 'block' }}>
                              错误信息
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                              {subTask.errorMessage}
                            </Text>
                            {subTask.errorAt && (
                              <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
                                错误时间:{' '}
                                {new Date(subTask.errorAt).toLocaleString('zh-CN')}
                              </Text>
                            )}
                          </div>
                        </Space>
                      </div>
                    )}
                  </Space>
                </Card>
              );
            })}
          </Space>
        )}
      </Card>
    </Space>
  );
}

