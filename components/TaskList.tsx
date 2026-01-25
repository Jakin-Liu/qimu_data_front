'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Badge,
  Button,
  Space,
  Typography,
  Tooltip,
  Popover,
  Spin,
  Empty,
  message,
} from 'antd';
import {
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlayCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  CopyOutlined,
  CheckOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import type { Task } from '@/lib/types/task';

const { Text, Paragraph } = Typography;

interface TaskListProps {
  filterStatus: 'all' | 'pending' | 'processing' | 'completed' | 'failed';
}

export default function TaskList({ filterStatus }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [startingTasks, setStartingTasks] = useState<Set<string>>(new Set());
  const [copiedTasks, setCopiedTasks] = useState<Set<string>>(new Set());
  const router = useRouter();

  const fetchTasks = async () => {
    try {
      // Mock API call
      const mockTasks: Task[] = [
        {
          id: 'task-001',
          status: 'pending',
          urls: [
            'https://www.fastmoss.com/zh/e-commerce/detail/123456789',
            'https://www.fastmoss.com/zh/e-commerce/detail/987654321',
          ],
          createdAt: new Date().toISOString(),
          remark: '测试任务备注信息',
        },
        {
          id: 'task-002',
          status: 'processing',
          urls: ['https://www.fastmoss.com/zh/e-commerce/detail/456789123'],
          createdAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: 'task-003',
          status: 'completed',
          urls: ['https://www.fastmoss.com/zh/e-commerce/detail/789123456'],
          createdAt: new Date(Date.now() - 7200000).toISOString(),
          completedAt: new Date().toISOString(),
          csvUrl: '/api/tasks/task-003/csv',
        },
      ];
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTasks(mockTasks);
    } catch (error) {
      message.error('获取任务列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
    const interval = setInterval(fetchTasks, 5000);
    return () => clearInterval(interval);
  }, []);

  const filteredTasks =
    filterStatus === 'all'
      ? tasks
      : tasks.filter((task) => task.status === filterStatus);

  const getStatusConfig = (status: Task['status']) => {
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

  const handleDownload = async (taskId: string) => {
    try {
      message.success('CSV文件已开始下载');
      // Mock download
    } catch (error) {
      message.error('下载CSV失败');
    }
  };

  const handleStartTask = async (taskId: string) => {
    setStartingTasks((prev) => new Set(prev).add(taskId));
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      message.success('任务启动成功');
      fetchTasks();
    } catch (error) {
      message.error('启动任务失败');
    } finally {
      setStartingTasks((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskId);
        return newSet;
      });
    }
  };

  const handleCopyTaskId = async (taskId: string) => {
    try {
      await navigator.clipboard.writeText(taskId);
      setCopiedTasks((prev) => new Set(prev).add(taskId));
      message.success('任务ID已复制到剪贴板');
      setTimeout(() => {
        setCopiedTasks((prev) => {
          const newSet = new Set(prev);
          newSet.delete(taskId);
          return newSet;
        });
      }, 2000);
    } catch (error) {
      message.error('无法复制到剪贴板');
    }
  };

  const handleViewDetail = (taskId: string) => {
    router.push(`/tasks/${taskId}`);
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
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button icon={<ReloadOutlined />} onClick={fetchTasks}>
          刷新
        </Button>
      </div>

      {filteredTasks.length === 0 ? (
        <Empty description="暂无任务" />
      ) : (
        <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
          {filteredTasks.map((task) => {
            const statusConfig = getStatusConfig(task.status);
            const urlsContent = (
              <div style={{ maxWidth: 400, maxHeight: 300, overflow: 'auto' }}>
                <Text strong style={{ marginBottom: 8, display: 'block' }}>
                  抓取的URLs ({task.urls.length}):
                </Text>
                <ul style={{ paddingLeft: 20, margin: 0 }}>
                  {task.urls.map((url, index) => (
                    <li key={index} style={{ marginBottom: 4, wordBreak: 'break-all' }}>
                      <Text code style={{ fontSize: 12 }}>
                        {url}
                      </Text>
                    </li>
                  ))}
                </ul>
              </div>
            );

            return (
              <Card
                key={task.id}
                hoverable
                onClick={() => handleViewDetail(task.id)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: 16,
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Space align="start" style={{ marginBottom: 12, width: '100%' }}>
                      <Badge
                        status={statusConfig.color as any}
                        text={statusConfig.text}
                        style={{ fontSize: 14 }}
                      />
                      <Space size="small">
                        <Text type="secondary" code style={{ fontSize: 12 }}>
                          ID: {task.id}
                        </Text>
                        <Tooltip
                          title={copiedTasks.has(task.id) ? '已复制' : '复制任务ID'}
                        >
                          <Button
                            type="text"
                            size="small"
                            icon={
                              copiedTasks.has(task.id) ? (
                                <CheckOutlined style={{ color: '#52c41a' }} />
                              ) : (
                                <CopyOutlined />
                              )
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyTaskId(task.id);
                            }}
                          />
                        </Tooltip>
                        {task.remark && (
                          <Tooltip title={task.remark}>
                            <Text
                              type="secondary"
                              ellipsis
                              style={{
                                maxWidth: 200,
                                fontSize: 12,
                                background: '#f5f5f5',
                                padding: '2px 8px',
                                borderRadius: 4,
                              }}
                            >
                              {task.remark}
                            </Text>
                          </Tooltip>
                        )}
                      </Space>
                    </Space>

                    <Space orientation="vertical" size="small" style={{ fontSize: 14 }}>
                      <Popover content={urlsContent} title="URL列表" trigger="hover">
                        <Text type="secondary" style={{ cursor: 'help' }}>
                          URLs: {task.urls.length} 个
                        </Text>
                      </Popover>
                      <Text type="secondary">
                        创建时间:{' '}
                        {new Date(task.createdAt).toLocaleString('zh-CN')}
                      </Text>
                      {task.completedAt && (
                        <Text type="secondary">
                          完成时间:{' '}
                          {new Date(task.completedAt).toLocaleString('zh-CN')}
                        </Text>
                      )}
                      {task.error && (
                        <Text type="danger">错误: {task.error}</Text>
                      )}
                    </Space>
                  </div>

                  <Space
                    onClick={(e) => e.stopPropagation()}
                    style={{ flexShrink: 0 }}
                  >
                    <Button
                      size="small"
                      icon={<EyeOutlined />}
                      onClick={() => handleViewDetail(task.id)}
                    >
                      查看详情
                    </Button>
                    {task.status === 'pending' && (
                      <Button
                        type="primary"
                        size="small"
                        icon={
                          startingTasks.has(task.id) ? (
                            <LoadingOutlined />
                          ) : (
                            <PlayCircleOutlined />
                          )
                        }
                        loading={startingTasks.has(task.id)}
                        onClick={() => handleStartTask(task.id)}
                      >
                        启动
                      </Button>
                    )}
                    {task.status === 'completed' && (
                      <Button
                        type="primary"
                        size="small"
                        icon={<DownloadOutlined />}
                        onClick={() => handleDownload(task.id)}
                      >
                        下载CSV
                      </Button>
                    )}
                  </Space>
                </div>
              </Card>
            );
          })}
        </Space>
      )}
    </Space>
  );
}

