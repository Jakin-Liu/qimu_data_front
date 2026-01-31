'use client';

import { useState, useEffect } from 'react';
import {
  Drawer,
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
} from 'antd';
import {
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
} from '@ant-design/icons';
import type { TaskDefinition, TaskInstance, TaskInstanceListResponse, ApiResponse } from '@/lib/types/task';
import { get, post } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { Title, Text } = Typography;

interface TaskDefinitionDetailDrawerProps {
  open: boolean;
  definitionId: string | null;
  onClose: () => void;
}

export default function TaskDefinitionDetailDrawer({
  open,
  definitionId,
  onClose,
}: TaskDefinitionDetailDrawerProps) {
  const router = useRouter();

  const [taskDefinition, setTaskDefinition] = useState<TaskDefinition | null>(null);
  const [taskInstances, setTaskInstances] = useState<TaskInstance[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isInstancesLoading, setIsInstancesLoading] = useState(false);
  const [isBuilding, setIsBuilding] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [copiedDefinitionId, setCopiedDefinitionId] = useState(false);

  // 获取任务定义详情
  const fetchTaskDefinition = async () => {
    if (!definitionId) return;
    
    try {
      setIsLoading(true);
      // TODO: 调用获取任务定义详情的API
      // const response = await get<ApiResponse<TaskDefinition>>(`/task/definition/${definitionId}`);
      // setTaskDefinition(response.data);
      
      // 临时：从列表API中查找
      const response = await get<ApiResponse<TaskInstanceListResponse>>('/task/definition/list', {
        taskDefinitionId: definitionId,
        page: 1,
        pageSize: 1,
      });
      
      if (response.data.list.length > 0) {
        // 这里需要根据实际API调整
        const task = response.data.list[0] as any;
        setTaskDefinition({
          id: task.id,
          merchantId: task.merchantId,
          userId: task.userId,
          definitionId: task.definitionId,
          name: task.name,
          description: task.description,
          splitStrategy: task.splitStrategy,
          excutor: task.excutor,
          config: task.config,
          createdAt: task.createdAt,
          updatedAt: task.updatedAt,
        });
      }
    } catch (error: any) {
      console.error('获取任务定义失败:', error);
      message.error(error?.message || '获取任务定义失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取任务实例列表
  const fetchTaskInstances = async (page = 1, pageSize = 10) => {
    if (!definitionId) return;
    
    try {
      setIsInstancesLoading(true);
      // TODO: 调用获取任务实例列表的API
      // const response = await get<ApiResponse<TaskInstanceListResponse>>(`/task/definition/${definitionId}/instances`, {
      //   page,
      //   pageSize,
      // });
      
      // 临时：使用模拟数据
      const mockResponse: ApiResponse<TaskInstanceListResponse> = {
        data: {
          list: [],
          total: 0,
          page: 1,
          pageSize: 10,
        },
        code: 0,
        message: 'success',
      };
      
      setTaskInstances(mockResponse.data.list);
      setPagination({
        current: mockResponse.data.page,
        pageSize: mockResponse.data.pageSize,
        total: mockResponse.data.total,
      });
    } catch (error: any) {
      console.error('获取任务实例列表失败:', error);
      message.error(error?.message || '获取任务实例列表失败');
    } finally {
      setIsInstancesLoading(false);
    }
  };

  useEffect(() => {
    if (open && definitionId) {
      fetchTaskDefinition();
      fetchTaskInstances();
    }
  }, [open, definitionId]);

  const handleCopyDefinitionId = async () => {
    if (!definitionId) return;
    try {
      await navigator.clipboard.writeText(definitionId);
      setCopiedDefinitionId(true);
      message.success('定义ID已复制到剪贴板');
      setTimeout(() => setCopiedDefinitionId(false), 2000);
    } catch (error) {
      message.error('无法复制到剪贴板');
    }
  };

  const handleViewInstance = (instanceId: number) => {
    router.push(`/task-instance/${instanceId}`);
  };

  // 根据任务定义创建任务实例
  const handleBuildInstance = async () => {
    if (!definitionId) return;
    
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
    }
  };

  return (
    <Drawer
      title={taskDefinition?.name || '任务定义详情'}
      placement="right"
      size={800}
      onClose={onClose}
      open={open}
      destroyOnClose
    >
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      ) : !taskDefinition ? (
        <Empty description="任务定义不存在" />
      ) : (
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          {/* 任务定义详情 */}
          <Card>
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
          </Card>

          {/* 任务实例列表 */}
          <Card 
            title="任务实例列表"
            extra={
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleBuildInstance}
                loading={isBuilding}
                size="small"
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
                size="small"
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
                        key={instance.id}
                        hoverable
                        onClick={() => handleViewInstance(instance.id)}
                        style={{ cursor: 'pointer' }}
                        size="small"
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
                                icon={statusConfig.icon}
                                color={statusConfig.color}
                              >
                                {statusConfig.text}
                              </Tag>
                              <Text type="secondary" code style={{ fontSize: 12 }}>
                                实例ID: {instance.id}
                              </Text>
                            </Space>
                            <Space size="large" wrap style={{ fontSize: 12 }}>
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
                                <Text type="danger" style={{ fontSize: 12 }}>错误: {instance.errorMessage}</Text>
                              </div>
                            )}
                          </div>
                          <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewInstance(instance.id);
                            }}
                          >
                            查看详情
                          </Button>
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
                      size="small"
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </Space>
      )}
    </Drawer>
  );
}

