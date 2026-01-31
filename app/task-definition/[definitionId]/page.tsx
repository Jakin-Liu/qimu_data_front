'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  Card,
  Button,
  Space,
  Typography,
  Tag,
  Spin,
  Empty,
  message,
  Pagination,
  Tooltip,
  Descriptions,
  Drawer,
} from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  EyeOutlined,
  CopyOutlined,
  CheckOutlined,
  CodeOutlined,
  SettingOutlined,
  UserOutlined,
  ShopOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  PlusOutlined,
  InfoCircleOutlined,
  PlayCircleOutlined,
} from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import type { TaskDefinition, TaskInstance, TaskInstanceListResponse, ApiResponse } from '@/lib/types/task';
import { get, post } from '@/lib/api';

const { Title, Text } = Typography;

export default function TaskDefinitionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const definitionId = params.definitionId as string;

  const [taskDefinition, setTaskDefinition] = useState<TaskDefinition | null>(null);
  const [taskInstances, setTaskInstances] = useState<TaskInstance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInstancesLoading, setIsInstancesLoading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [copiedDefinitionId, setCopiedDefinitionId] = useState(false);
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false); // 默认不打开抽屉
  const [startingInstances, setStartingInstances] = useState<Set<string>>(new Set()); // 正在启动的实例ID集合

  // 获取任务定义详情
  const fetchTaskDefinition = async () => {
    try {
      setIsLoading(true);
      const response = await get<ApiResponse<TaskDefinition>>(`/task/definition/${definitionId}`);
      
      if (response.code !== 0) {
        throw new Error(response.message || '获取任务定义失败');
      }
      
      setTaskDefinition(response.data);
    } catch (error: any) {
      console.error('获取任务定义失败:', error);
      message.error(error?.message || '获取任务定义失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取任务实例列表
  const fetchTaskInstances = async (page = 1, pageSize = 10) => {
    try {
      setIsInstancesLoading(true);
      const response = await post<ApiResponse<TaskInstanceListResponse>>('/task/instance/list', {
        taskDefinitionId: definitionId,
      });
      
      if (response.code !== 0) {
        throw new Error(response.message || '获取任务实例列表失败');
      }
      
      setTaskInstances(response.data.list);
      setPagination({
        current: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total,
      });
    } catch (error: any) {
      console.error('获取任务实例列表失败:', error);
      message.error(error?.message || '获取任务实例列表失败');
    } finally {
      setIsInstancesLoading(false);
    }
  };

  useEffect(() => {
    if (definitionId) {
      fetchTaskDefinition();
      fetchTaskInstances();
    }
  }, [definitionId]);

  const handleCopyDefinitionId = async () => {
    try {
      await navigator.clipboard.writeText(definitionId);
      setCopiedDefinitionId(true);
      message.success('定义ID已复制到剪贴板');
      setTimeout(() => setCopiedDefinitionId(false), 2000);
    } catch (error) {
      message.error('无法复制到剪贴板');
    }
  };

  const handleViewInstance = (instanceId: string) => {
    router.push(`/task-instance/${instanceId}`);
  };

  // 根据任务定义创建任务实例
  const handleBuildInstance = async () => {
    try {
      setIsBuilding(true);
      console.log('🔨 创建任务实例，任务定义ID:', definitionId);

      const response = await post<ApiResponse<any>>('/task/definition/build', {
        taskDefinitionId: definitionId,
      });

      console.log('✅ 创建任务实例响应:', response);

      if (response.code !== 0) {
        throw new Error(response.message || '创建任务实例失败');
      }

      message.success('任务实例创建成功');
      // 刷新任务实例列表
      fetchTaskInstances(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error('❌ 创建任务实例失败:', error);
      message.error(error?.message || '创建任务实例失败');
    } finally {
      setIsBuilding(false);
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchTaskInstances(page, pageSize);
  };

  // 启动任务实例
  const handleStartInstance = async (taskInstanceId: string) => {
    try {
      setStartingInstances((prev) => new Set(prev).add(taskInstanceId));
      console.log('🚀 启动任务实例，实例ID:', taskInstanceId);

      const response = await post<ApiResponse<any>>('/task/instance/run', {
        taskInstanceId: taskInstanceId,
      });

      console.log('✅ 启动任务实例响应:', response);

      if (response.code !== 0) {
        throw new Error(response.message || '启动任务实例失败');
      }

      message.success('任务实例启动成功');
      // 刷新任务实例列表
      fetchTaskInstances(pagination.current, pagination.pageSize);
    } catch (error: any) {
      console.error('❌ 启动任务实例失败:', error);
      message.error(error?.message || '启动任务实例失败');
    } finally {
      setStartingInstances((prev) => {
        const newSet = new Set(prev);
        newSet.delete(taskInstanceId);
        return newSet;
      });
    }
  };

  const getStatusConfig = (status: TaskInstance['status']) => {
    switch (status) {
      case 'pending':
        return { icon: <ClockCircleOutlined />, color: 'default', text: '等待中' };
      case 'processing':
        return { icon: <LoadingOutlined spin />, color: 'processing', text: '处理中' };
      case 'completed':
        return { icon: <CheckCircleOutlined />, color: 'success', text: '已完成' };
      case 'failed':
        return { icon: <CloseCircleOutlined />, color: 'error', text: '失败' };
      default:
        return { icon: <ClockCircleOutlined />, color: 'default', text: '未知状态' };
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!taskDefinition) {
    return (
      <DashboardLayout>
        <Empty description="任务定义不存在" />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面头部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={() => router.push('/task-definition')}>
              返回任务列表
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              {taskDefinition.name}
            </Title>
          </Space>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setDetailDrawerOpen(true)}
          >
            查看任务定义详情
          </Button>
        </div>

        {/* 任务实例列表 */}
        <Card 
          title="任务实例列表"
          extra={
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={handleBuildInstance}
              loading={isBuilding}
            >
              创建任务实例
            </Button>
          }
        >
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">共 {pagination.total} 个任务实例</Text>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchTaskInstances(pagination.current, pagination.pageSize)}
              loading={isInstancesLoading}
              style={{ float: 'right' }}
            >
              刷新
            </Button>
          </div>

          {isInstancesLoading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Spin size="large" />
            </div>
          ) : taskInstances.length === 0 ? (
            <Empty description="暂无任务实例" />
          ) : (
            <>
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                {taskInstances.map((instance) => {
                  const statusConfig = getStatusConfig(instance.status);
                  return (
                    <Card
                      key={instance.taskInstanceId}
                      hoverable
                      onClick={() => handleViewInstance(instance.taskInstanceId)}
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
                        <div style={{ flex: 1 }}>
                          <Space align="start" style={{ marginBottom: 12 }} wrap>
                            <Tag
                              icon={statusConfig?.icon}
                              color={statusConfig?.color}
                            >
                              {statusConfig?.text || '未知状态'}
                            </Tag>
                            <Text type="secondary" code>
                              实例ID: {instance.taskInstanceId}
                            </Text>
                          </Space>
                          <Space size="large">
                            {instance.startedAt && (
                              <Text type="secondary">
                                开始时间: {new Date(instance.startedAt).toLocaleString('zh-CN')}
                              </Text>
                            )}
                            {instance.completedAt && (
                              <Text type="secondary">
                                完成时间: {new Date(instance.completedAt).toLocaleString('zh-CN')}
                              </Text>
                            )}
                            <Text type="secondary">
                              创建时间: {new Date(instance.createdAt).toLocaleString('zh-CN')}
                            </Text>
                          </Space>
                          {instance.errorMessage && (
                            <div style={{ marginTop: 8 }}>
                              <Text type="danger">错误: {instance.errorMessage}</Text>
                            </div>
                          )}
                        </div>
                        <Space>
                          <Button
                            type="primary"
                            size="small"
                            icon={<PlayCircleOutlined />}
                            loading={startingInstances.has(instance.taskInstanceId)}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartInstance(instance.taskInstanceId);
                            }}
                            disabled={instance.status === 'processing' || instance.status === 'completed'}
                          >
                            启动
                          </Button>
                          <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewInstance(instance.taskInstanceId);
                            }}
                          >
                            查看详情
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  );
                })}
              </Space>

              {pagination.total > 0 && (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
                  <Pagination
                    current={pagination.current}
                    pageSize={pagination.pageSize}
                    total={pagination.total}
                    showSizeChanger
                    showQuickJumper
                    showTotal={(total) => `共 ${total} 条`}
                    onChange={handlePageChange}
                    onShowSizeChange={handlePageChange}
                    pageSizeOptions={['10', '20', '50', '100']}
                  />
                </div>
              )}
            </>
          )}
        </Card>
      </Space>

      {/* 任务定义详情抽屉 */}
      <Drawer
        title={taskDefinition.name || '任务定义详情'}
        placement="right"
        size={600}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        ) : !taskDefinition ? (
          <Empty description="任务定义不存在" />
        ) : (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="定义ID">
              <Space>
                <Text code>{taskDefinition.definitionId}</Text>
                <Tooltip title={copiedDefinitionId ? '已复制' : '复制定义ID'}>
                  <Button
                    type="text"
                    size="small"
                    icon={copiedDefinitionId ? <CheckOutlined style={{ color: '#52c41a' }} /> : <CopyOutlined />}
                    onClick={handleCopyDefinitionId}
                  />
                </Tooltip>
              </Space>
            </Descriptions.Item>
            <Descriptions.Item label="任务ID">{taskDefinition.id}</Descriptions.Item>
            <Descriptions.Item label="分割策略">
              <Tag icon={<SettingOutlined />} color="purple">
                {taskDefinition.splitStrategy}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="执行器">
              <Tag color="green">{taskDefinition.excutor}</Tag>
            </Descriptions.Item>
            {taskDefinition.merchantId && (
              <Descriptions.Item label="商户ID">
                <Tag icon={<ShopOutlined />} color="orange">
                  {taskDefinition.merchantId}
                </Tag>
              </Descriptions.Item>
            )}
            {taskDefinition.userId && (
              <Descriptions.Item label="用户ID">
                <Tag icon={<UserOutlined />} color="cyan">
                  {taskDefinition.userId}
                </Tag>
              </Descriptions.Item>
            )}
            {taskDefinition.description && (
              <Descriptions.Item label="描述">
                {taskDefinition.description}
              </Descriptions.Item>
            )}
            <Descriptions.Item label="创建时间">
              {new Date(taskDefinition.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {new Date(taskDefinition.updatedAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </DashboardLayout>
  );
}

