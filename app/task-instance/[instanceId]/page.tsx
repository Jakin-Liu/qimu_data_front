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
  Progress,
  Statistic,
  Row,
  Col,
  Drawer,
} from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import type { TaskInstance, SubTask, SubTaskListResponse, ApiResponse } from '@/lib/types/task';
import { get, post } from '@/lib/api';

const { Title, Text } = Typography;

export default function TaskInstanceDetailPage() {
  const params = useParams();
  const router = useRouter();
  const instanceId = params.instanceId as string;

  const [taskInstance, setTaskInstance] = useState<TaskInstance | null>(null);
  const [subTasks, setSubTasks] = useState<SubTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubTasksLoading, setIsSubTasksLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false); // 默认不打开抽屉

  // 获取任务实例详情
  const fetchTaskInstance = async () => {
    try {
      setIsLoading(true);
      // TODO: 调用获取任务实例详情的API
      // const response = await get<ApiResponse<TaskInstance>>(`/task-instance/${instanceId}`);
      // setTaskInstance(response.data);
      
      // 临时：使用模拟数据
      const mockInstance: TaskInstance = {
        id: 0,
        taskInstanceId: instanceId,
        definitionId: 'name_filter_1769841578788',
        status: 'processing',
        startedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setTaskInstance(mockInstance);
    } catch (error: any) {
      console.error('获取任务实例失败:', error);
      message.error(error?.message || '获取任务实例失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 获取子任务列表
  const fetchSubTasks = async (page = 1, pageSize = 10) => {
    try {
      setIsSubTasksLoading(true);
      const response = await post<ApiResponse<SubTaskListResponse>>('/task/subtask/list', {
        taskInstanceId: instanceId,
      });
      
      if (response.code !== 0) {
        throw new Error(response.message || '获取子任务列表失败');
      }
      
      setSubTasks(response.data.list);
      setPagination({
        current: response.data.page || page,
        pageSize: response.data.pageSize || pageSize,
        total: response.data.total,
      });
    } catch (error: any) {
      console.error('获取子任务列表失败:', error);
      message.error(error?.message || '获取子任务列表失败');
    } finally {
      setIsSubTasksLoading(false);
    }
  };

  useEffect(() => {
    if (instanceId) {
      fetchTaskInstance();
      fetchSubTasks();
    }
  }, [instanceId]);


  const handleBack = () => {
    if (taskInstance) {
      router.push(`/task-definition/${taskInstance.definitionId}`);
    } else {
      router.push('/task-definition');
    }
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchSubTasks(page, pageSize);
  };

  const getStatusConfig = (status: TaskInstance['status'] | SubTask['status']) => {
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

  // 计算统计信息
  const stats = {
    total: subTasks.length,
    completed: subTasks.filter((t) => t.status === 'completed').length,
    processing: subTasks.filter((t) => t.status === 'processing').length,
    pending: subTasks.filter((t) => t.status === 'pending').length,
    failed: subTasks.filter((t) => t.status === 'failed').length,
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

  if (!taskInstance) {
    return (
      <DashboardLayout>
        <Empty description="任务实例不存在" />
      </DashboardLayout>
    );
  }

  const statusConfig = getStatusConfig(taskInstance.status);
  const completionRate = stats.total > 0 ? (stats.completed / stats.total) * 100 : 0;

  return (
    <DashboardLayout>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        {/* 页面头部 */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
              返回
            </Button>
            <Title level={2} style={{ margin: 0 }}>
              任务实例详情
            </Title>
          </Space>
          <Button
            icon={<InfoCircleOutlined />}
            onClick={() => setDetailDrawerOpen(true)}
          >
            查看任务实例详情
          </Button>
        </div>

        {/* 统计信息 */}
        {stats.total > 0 && (
          <Card title="子任务统计">
            <Row gutter={16}>
              <Col span={6}>
                <Statistic title="总数" value={stats.total} />
              </Col>
              <Col span={6}>
                <Statistic
                  title="已完成"
                  value={stats.completed}
                  styles={{ content: { color: '#3f8600' } }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="处理中"
                  value={stats.processing}
                  styles={{ content: { color: '#1890ff' } }}
                />
              </Col>
              <Col span={6}>
                <Statistic
                  title="失败"
                  value={stats.failed}
                  styles={{ content: { color: '#cf1322' } }}
                />
              </Col>
            </Row>
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">完成率: </Text>
              <Progress percent={completionRate} status={completionRate === 100 ? 'success' : 'active'} />
            </div>
          </Card>
        )}

        {/* 子任务列表 */}
        <Card title="子任务列表">
          <div style={{ marginBottom: 16 }}>
            <Text type="secondary">共 {pagination.total} 个子任务</Text>
            <Button
              icon={<ReloadOutlined />}
              onClick={() => fetchSubTasks(pagination.current, pagination.pageSize)}
              loading={isSubTasksLoading}
              style={{ float: 'right' }}
            >
              刷新
            </Button>
          </div>

          {isSubTasksLoading ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <Spin size="large" />
            </div>
          ) : subTasks.length === 0 ? (
            <Empty description="暂无子任务" />
          ) : (
            <>
              <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                {subTasks.map((subTask) => {
                  const subTaskStatusConfig = getStatusConfig(subTask.status);
                  return (
                    <Card
                      key={subTask.subtaskId}
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
                              icon={subTaskStatusConfig.icon}
                              color={subTaskStatusConfig.color}
                            >
                              {subTaskStatusConfig.text}
                            </Tag>
                            <Text type="secondary" code>
                              子任务ID: {subTask.subtaskId}
                            </Text>
                            {subTask.url && (
                              <Text type="secondary" ellipsis style={{ maxWidth: 400 }}>
                                URL: {subTask.url}
                              </Text>
                            )}
                          </Space>
                          {subTask.currentPage !== undefined && subTask.totalPages !== undefined && (
                            <div style={{ marginBottom: 8 }}>
                              <Text type="secondary">
                                进度: {subTask.currentPage} / {subTask.totalPages} 页
                              </Text>
                              <Progress
                                percent={Math.round((subTask.currentPage / subTask.totalPages) * 100)}
                                size="small"
                                style={{ marginTop: 4 }}
                              />
                            </div>
                          )}
                          <Space size="large">
                            {subTask.startedAt && (
                              <Text type="secondary">
                                开始时间: {new Date(subTask.startedAt).toLocaleString('zh-CN')}
                              </Text>
                            )}
                            {subTask.completedAt && (
                              <Text type="secondary">
                                完成时间: {new Date(subTask.completedAt).toLocaleString('zh-CN')}
                              </Text>
                            )}
                            <Text type="secondary">
                              创建时间: {new Date(subTask.createdAt).toLocaleString('zh-CN')}
                            </Text>
                          </Space>
                          {subTask.errorMessage && (
                            <div style={{ marginTop: 8 }}>
                              <Text type="danger">错误: {subTask.errorMessage}</Text>
                            </div>
                          )}
                        </div>
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

      {/* 任务实例详情抽屉 */}
      <Drawer
        title="任务实例详情"
        placement="right"
        size={600}
        onClose={() => setDetailDrawerOpen(false)}
        open={detailDrawerOpen}
      >
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <Spin size="large" />
          </div>
        ) : !taskInstance ? (
          <Empty description="任务实例不存在" />
        ) : (
          <Descriptions bordered column={1}>
            <Descriptions.Item label="实例ID">{taskInstance.taskInstanceId}</Descriptions.Item>
            <Descriptions.Item label="定义ID">
              <Text code>{taskInstance.definitionId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              {(() => {
                const drawerStatusConfig = getStatusConfig(taskInstance.status);
                return (
                  <Tag icon={drawerStatusConfig.icon} color={drawerStatusConfig.color}>
                    {drawerStatusConfig.text}
                  </Tag>
                );
              })()}
            </Descriptions.Item>
            {taskInstance.startedAt && (
              <Descriptions.Item label="开始时间">
                {new Date(taskInstance.startedAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
            )}
            {taskInstance.completedAt && (
              <Descriptions.Item label="完成时间">
                {new Date(taskInstance.completedAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
            )}
            {taskInstance.errorMessage && (
              <Descriptions.Item label="错误信息">
                <Text type="danger">{taskInstance.errorMessage}</Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="创建时间">
              {new Date(taskInstance.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {new Date(taskInstance.updatedAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
        )}
      </Drawer>
    </DashboardLayout>
  );
}

