'use client';

import { useState, useEffect } from 'react';
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
  Tooltip,
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
  GlobalOutlined,
  AimOutlined,
  CopyOutlined,
  CheckOutlined,
  LinkOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import type { TaskProgress, TaskProgressSummary } from '@/lib/types/task';

const { Title, Text, Paragraph } = Typography;

interface TaskDetailProps {
  taskId: string;
  onBack: () => void;
}

export default function TaskDetail({ taskId, onBack }: TaskDetailProps) {
  const [progress, setProgress] = useState<TaskProgress[]>([]);
  const [summary, setSummary] = useState<TaskProgressSummary | null>(null);
  const [taskUrls, setTaskUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedUrls, setCopiedUrls] = useState<Set<number>>(new Set());

  const fetchProgress = async (showSuccessToast = false) => {
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      const mockProgress: TaskProgress[] = [
        {
          id: 1,
          taskId,
          url: 'https://www.fastmoss.com/zh/e-commerce/detail/123456789',
          currentPage: 5,
          totalPages: 10,
          status: 'processing',
          startedAt: new Date(Date.now() - 3600000).toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: 2,
          taskId,
          url: 'https://www.fastmoss.com/zh/e-commerce/detail/987654321',
          currentPage: 10,
          totalPages: 10,
          status: 'completed',
          startedAt: new Date(Date.now() - 7200000).toISOString(),
          completedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];

      const mockSummary: TaskProgressSummary = {
        totalUrls: 2,
        completedUrls: 1,
        failedUrls: 0,
        processingUrls: 1,
        pendingUrls: 0,
        totalPages: 15,
        maxPages: 20,
        completionRate: 50,
      };

      setProgress(mockProgress);
      setSummary(mockSummary);
      setTaskUrls(mockProgress.map((p) => p.url));

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
    fetchProgress();
    const interval = setInterval(fetchProgress, 5000);
    return () => clearInterval(interval);
  }, [taskId]);

  const getStatusConfig = (status: TaskProgress['status']) => {
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

  const handleCopyUrl = async (url: string, index: number) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedUrls((prev) => new Set(prev).add(index));
      message.success('URL已复制到剪贴板');
      setTimeout(() => {
        setCopiedUrls((prev) => {
          const newSet = new Set(prev);
          newSet.delete(index);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      message.error('无法复制URL到剪贴板');
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return '未开始';
    return new Date(timeString).toLocaleString('zh-CN');
  };

  const getPageProgress = (currentPage: number, totalPages: number) => {
    if (totalPages === 0) return 0;
    return Math.round((currentPage / totalPages) * 100);
  };

  const getProgressForUrl = (url: string) => {
    return progress.find((p) => p.url === url);
  };

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text type="secondary">加载任务详情中...</Text>
        </div>
      </div>
    );
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={onBack}>
            返回任务列表
          </Button>
          <div>
            <Title level={2} style={{ margin: 0 }}>
              任务进度详情
            </Title>
            <Text type="secondary" code>
              {taskId}
            </Text>
          </div>
        </Space>
        <Button icon={<ReloadOutlined />} onClick={() => fetchProgress(true)}>
          刷新数据
        </Button>
      </div>

      {summary && (
        <Card title="总体进度概览">
          <Row gutter={16} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="总URL数"
                value={summary.totalUrls}
                prefix={<GlobalOutlined />}
                styles={{ content: { color: '#1890ff' } }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="已完成"
                value={summary.completedUrls}
                prefix={<CheckCircleOutlined />}
                styles={{ content: { color: '#52c41a' } }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="失败"
                value={summary.failedUrls}
                prefix={<CloseCircleOutlined />}
                styles={{ content: { color: '#ff4d4f' } }}
              />
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Statistic
                title="处理中"
                value={summary.processingUrls}
                prefix={<LoadingOutlined />}
                styles={{ content: { color: '#faad14' } }}
              />
            </Col>
          </Row>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <Space>
                <AimOutlined style={{ color: '#1890ff' }} />
                <Text strong>整体完成率</Text>
              </Space>
              <Text strong style={{ fontSize: 24, color: '#1890ff' }}>
                {summary.completionRate}%
              </Text>
            </div>
            <Progress percent={summary.completionRate} />
          </div>
          <Row gutter={16} style={{ marginTop: 24 }}>
            <Col xs={24} sm={12}>
              <Statistic title="已抓取页数" value={summary.totalPages} />
            </Col>
            <Col xs={24} sm={12}>
              <Statistic title="预估总页数" value={summary.maxPages} />
            </Col>
          </Row>
        </Card>
      )}

      <Card title="URL进度详情">
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          {taskUrls.map((url, index) => {
            const progressItem = getProgressForUrl(url);
            const statusConfig = progressItem
              ? getStatusConfig(progressItem.status)
              : {
                  icon: <ClockCircleOutlined />,
                  color: 'default',
                  text: '未开始',
                };

            return (
              <Card
                key={url}
                size="small"
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
                      <Space align="start" style={{ marginBottom: 12 }}>
                        <Badge
                          status={statusConfig.color as any}
                          text={statusConfig.text}
                        />
                        <Text type="secondary">#{index + 1}</Text>
                      </Space>
                      <div
                        style={{
                          background: '#f5f5f5',
                          padding: 12,
                          borderRadius: 4,
                          marginBottom: 12,
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                          }}
                        >
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            目标URL
                          </Text>
                          <Button
                            type="text"
                            size="small"
                            icon={
                              copiedUrls.has(index) ? (
                                <CheckOutlined style={{ color: '#52c41a' }} />
                              ) : (
                                <CopyOutlined />
                              )
                            }
                            onClick={() => handleCopyUrl(url, index)}
                          />
                        </div>
                        <Text code style={{ fontSize: 12, wordBreak: 'break-all' }}>
                          {url}
                        </Text>
                      </div>
                      <div style={{ marginBottom: 12 }}>
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            marginBottom: 4,
                          }}
                        >
                          <Text strong>抓取进度</Text>
                          <Text strong style={{ color: '#1890ff' }}>
                            {progressItem
                              ? `${progressItem.currentPage} / ${progressItem.totalPages}`
                              : '0 / 0'}
                          </Text>
                        </div>
                        <Progress
                          percent={
                            progressItem
                              ? getPageProgress(
                                  progressItem.currentPage,
                                  progressItem.totalPages
                                )
                              : 0
                          }
                        />
                      </div>
                    </div>
                    <Button
                      icon={<LinkOutlined />}
                      onClick={() => window.open(url, '_blank')}
                    >
                      访问
                    </Button>
                  </div>

                  <Row gutter={16}>
                    <Col xs={24} sm={8}>
                      <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                        <Space>
                          <ClockCircleOutlined style={{ color: '#1890ff' }} />
                          <div>
                            <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                              开始时间
                            </Text>
                            <Text style={{ fontSize: 12 }}>
                              {progressItem
                                ? formatTime(progressItem.startedAt)
                                : '未开始'}
                            </Text>
                          </div>
                        </Space>
                      </div>
                    </Col>
                    {progressItem?.completedAt && (
                      <Col xs={24} sm={8}>
                        <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                          <Space>
                            <CheckCircleOutlined style={{ color: '#52c41a' }} />
                            <div>
                              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                完成时间
                              </Text>
                              <Text style={{ fontSize: 12 }}>
                                {formatTime(progressItem.completedAt)}
                              </Text>
                            </div>
                          </Space>
                        </div>
                      </Col>
                    )}
                    {progressItem?.errorAt && (
                      <Col xs={24} sm={8}>
                        <div style={{ background: '#f5f5f5', padding: 12, borderRadius: 4 }}>
                          <Space>
                            <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                            <div>
                              <Text type="secondary" style={{ fontSize: 12, display: 'block' }}>
                                错误时间
                              </Text>
                              <Text style={{ fontSize: 12 }}>
                                {formatTime(progressItem.errorAt)}
                              </Text>
                            </div>
                          </Space>
                        </div>
                      </Col>
                    )}
                  </Row>

                  {progressItem?.errorMessage && (
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
                        <div style={{ flex: 1 }}>
                          <Text strong style={{ color: '#ff4d4f', display: 'block', marginBottom: 4 }}>
                            错误详情
                          </Text>
                          <Text style={{ fontSize: 12 }}>{progressItem.errorMessage}</Text>
                        </div>
                      </Space>
                    </div>
                  )}
                </Space>
              </Card>
            );
          })}
        </Space>
      </Card>
    </Space>
  );
}

