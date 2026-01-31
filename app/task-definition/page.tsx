'use client';

import { useState, useEffect } from 'react';
import {
  Space,
  Row,
  Col,
  Button,
  message,
  Form,
  Input,
  Select,
  DatePicker,
  Card,
  Table,
  Tag,
  Spin,
  Empty,
  Pagination,
  Typography,
  Tooltip,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
  EyeOutlined,
  CopyOutlined,
  CheckOutlined,
  CodeOutlined,
  SettingOutlined,
  UserOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import DashboardLayout from '@/components/DashboardLayout';
import TaskCreationDialog from '@/components/TaskCreationDialog';
import type { Task, TaskListResponse, ApiResponse } from '@/lib/types/task';
import { get, post } from '@/lib/api';
import { useRouter } from 'next/navigation';

const { RangePicker } = DatePicker;
const { Text } = Typography;

type TaskStatus = 'all' | 'pending' | 'processing' | 'completed' | 'failed';
type TaskType = 'all' | 'data_collection' | 'review_task';

interface QueryParams {
  taskType?: TaskType;
  taskId?: string;
  startTime?: string;
  endTime?: string;
  status?: TaskStatus;
}

export default function TaskPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [form] = Form.useForm();
  const [queryParams, setQueryParams] = useState<QueryParams>({});
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [copiedTasks, setCopiedTasks] = useState<Set<number>>(new Set());
  const router = useRouter();

  // 映射 taskType 到 excutor
  const mapTaskTypeToExcutor = (taskType: TaskType): string | undefined => {
    const mapping: Record<string, string> = {
      data_collection: 'fastmoss',
      review_task: 'tiktok',
    };
    return mapping[taskType];
  };

  // 获取任务列表
  const fetchTasks = async (page = 1, pageSize = 10, filters?: QueryParams) => {
    try {
      setIsLoading(true);
      
      const body: Record<string, any> = {
        page,
        pageSize,
      };

      const activeFilters = filters || queryParams;
      
      // 映射查询参数到 API 参数
      if (activeFilters.taskId) {
        body.taskDefinitionId = activeFilters.taskId;
      }
      
      if (activeFilters.taskType && activeFilters.taskType !== 'all') {
        const excutor = mapTaskTypeToExcutor(activeFilters.taskType);
        if (excutor) {
          body.excutor = excutor;
        }
      }
      
      if (activeFilters.status && activeFilters.status !== 'all') {
        body.status = activeFilters.status;
      }
      
      if (activeFilters.startTime) {
        body.startTime = activeFilters.startTime;
      }
      
      if (activeFilters.endTime) {
        body.endTime = activeFilters.endTime;
      }

      console.log('🔍 [TaskPage] 发起API请求:', {
        endpoint: '/task/definition/list',
        body,
      });

      const apiResponse = await post<ApiResponse<TaskListResponse>>('/task/definition/list', body);
      
      console.log('✅ [TaskPage] API响应成功:', apiResponse);
      
      // 检查响应码
      if (apiResponse.code !== 0) {
        throw new Error(apiResponse.message || '请求失败');
      }
      
      const response = apiResponse.data;
      
      setTasks(response.list);
      setPagination({
        current: response.page,
        pageSize: response.pageSize,
        total: response.total,
      });
    } catch (error: any) {
      console.error('❌ [TaskPage] API请求失败:', error);
      message.error(error?.message || '获取任务列表失败');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理查询
  const handleSearch = (values: {
    taskType?: TaskType;
    taskId?: string;
    dateRange?: [Dayjs, Dayjs];
    status?: TaskStatus;
  }) => {
    const params: QueryParams = {};
    
    if (values.taskType && values.taskType !== 'all') {
      params.taskType = values.taskType;
    }
    
    if (values.taskId?.trim()) {
      params.taskId = values.taskId.trim();
    }
    
    if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
      const startDate = values.dateRange[0].startOf('day');
      const endDate = values.dateRange[1].endOf('day');
      params.startTime = startDate.toISOString();
      params.endTime = endDate.toISOString();
    }
    
    if (values.status && values.status !== 'all') {
      params.status = values.status;
    }
    
    setQueryParams(params);
    setPagination((prev) => ({ ...prev, current: 1 }));
    
    // 调用API获取任务列表
    fetchTasks(1, pagination.pageSize, params);
    message.success('查询条件已应用');
  };

  // 重置查询条件
  const handleReset = () => {
    form.resetFields();
    const emptyParams: QueryParams = {};
    setQueryParams(emptyParams);
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchTasks(1, pagination.pageSize, emptyParams);
    message.info('查询条件已重置');
  };

  // 初始加载
  useEffect(() => {
    fetchTasks(1, 10, {});
  }, []);

  // 监听任务创建事件，刷新列表
  useEffect(() => {
    const handleTaskCreated = () => {
      console.log('🔄 收到任务创建事件，刷新列表');
      fetchTasks(pagination.current, pagination.pageSize, queryParams);
    };

    window.addEventListener('task-created', handleTaskCreated);
    return () => {
      window.removeEventListener('task-created', handleTaskCreated);
    };
  }, [pagination.current, pagination.pageSize, queryParams]);

  // 复制任务ID
  const handleCopyTaskId = async (taskId: number) => {
    try {
      await navigator.clipboard.writeText(String(taskId));
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

  // 查看详情 - 跳转到任务定义详情页面
  const handleViewDetail = (task: Task) => {
    router.push(`/task-definition/${task.definitionId}`);
  };

  // 分页变化
  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
    fetchTasks(page, pageSize, queryParams);
  };

  return (
    <DashboardLayout>
      <div>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          {/* 查询表单 */}
          <Card>
            <Form
              form={form}
              layout="inline"
              onFinish={handleSearch}
              style={{ width: '100%' }}
            >
              <Row gutter={[16, 16]} style={{ width: '100%' }}>
                {/* 第一行：任务ID、任务类型、状态 */}
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item
                    name="taskId"
                    label="任务ID"
                    style={{ marginBottom: 0 }}
                  >
                    <Input
                      placeholder="请输入任务ID"
                      allowClear
                      style={{ width: 200 }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item
                    name="taskType"
                    label="任务类型"
                    initialValue="all"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      placeholder="请选择任务类型"
                      style={{ width: 200 }}
                      options={[
                        { value: 'all', label: '全部' },
                        { value: 'data_collection', label: '数据采集' },
                        { value: 'review_task', label: '评论任务' },
                      ]}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Form.Item
                    name="status"
                    label="状态"
                    initialValue="all"
                    style={{ marginBottom: 0 }}
                  >
                    <Select
                      placeholder="请选择状态"
                      style={{ width: 150 }}
                      options={[
                        { value: 'all', label: '全部' },
                        { value: 'pending', label: '等待中' },
                        { value: 'processing', label: '处理中' },
                        { value: 'completed', label: '已完成' },
                        { value: 'failed', label: '失败' },
                      ]}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[16, 16]} style={{ width: '100%', marginTop: 16 }}>
                {/* 第二行：时间范围和操作按钮 */}
                <Col xs={24} sm={18} lg={12}>
                  <Form.Item
                    name="dateRange"
                    label="时间范围"
                    style={{ marginBottom: 0 }}
                  >
                    <RangePicker
                      showTime
                      format="YYYY-MM-DD HH:mm:ss"
                      placeholder={['开始时间', '结束时间']}
                      style={{ width: '100%', maxWidth: 380 }}
                    />
                  </Form.Item>
            </Col>
                <Col xs={24} sm={6} lg={12}>
                  <Form.Item label=" " style={{ marginBottom: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Space>
                        <Button
                          type="primary"
                          htmlType="submit"
                          icon={<SearchOutlined />}
                          size="middle"
                        >
                          查询
                        </Button>
                        <Button
                          icon={<ReloadOutlined />}
                          onClick={handleReset}
                          size="middle"
                        >
                          重置
                        </Button>
                      </Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => setIsDialogOpen(true)}
                        size="middle"
                      >
                        创建任务
                      </Button>
                    </div>
                  </Form.Item>
                </Col>
          </Row>
            </Form>
          </Card>

          {/* 任务列表 */}
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">共 {pagination.total} 条任务</Text>
              <Button
                icon={<ReloadOutlined />}
                onClick={() => fetchTasks(pagination.current, pagination.pageSize, queryParams)}
                loading={isLoading}
                style={{ float: 'right' }}
              >
                刷新
              </Button>
            </div>

            {isLoading ? (
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <Spin size="large" />
              </div>
            ) : tasks.length === 0 ? (
              <Empty description="暂无任务" />
            ) : (
              <>
                <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                  {tasks.map((task) => (
                    <Card
                      key={task.id}
                      hoverable
                      onClick={() => handleViewDetail(task)}
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
                          <Space align="start" style={{ marginBottom: 12, width: '100%' }} wrap>
                            <Text strong style={{ fontSize: 16 }}>
                              {task.name}
                            </Text>
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
                            </Space>
                          </Space>

                          <Space orientation="vertical" size="small" style={{ fontSize: 14, width: '100%' }}>
                            <Space size="middle" wrap>
                              <Tooltip title="定义ID">
                                <Tag icon={<CodeOutlined />} color="blue">
                                  {task.definitionId}
                                </Tag>
                              </Tooltip>
                              <Tooltip title="分割策略">
                                <Tag icon={<SettingOutlined />} color="purple">
                                  {task.splitStrategy}
                                </Tag>
                              </Tooltip>
                              <Tooltip title="执行器">
                                <Tag color="green">
                                  {task.excutor}
                                </Tag>
                              </Tooltip>
                              {task.merchantId && (
                                <Tooltip title="商户ID">
                                  <Tag icon={<ShopOutlined />} color="orange">
                                    商户: {task.merchantId}
                                  </Tag>
                                </Tooltip>
                              )}
                              {task.userId && (
                                <Tooltip title="用户ID">
                                  <Tag icon={<UserOutlined />} color="cyan">
                                    用户: {task.userId}
                                  </Tag>
                                </Tooltip>
                              )}
                            </Space>

                            {task.description && (
                              <Text type="secondary" ellipsis style={{ maxWidth: '100%', display: 'block' }}>
                                <Text strong>描述：</Text>
                                {task.description}
                              </Text>
                            )}

                            <Space size="large" wrap>
                              <Text type="secondary">
                                <Text strong>创建时间：</Text>
                                {new Date(task.createdAt).toLocaleString('zh-CN', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </Text>
                              <Text type="secondary">
                                <Text strong>更新时间：</Text>
                                {new Date(task.updatedAt).toLocaleString('zh-CN', {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                  second: '2-digit',
                                })}
                              </Text>
                            </Space>
                          </Space>
                        </div>

                        <Space
                          onClick={(e) => e.stopPropagation()}
                          style={{ flexShrink: 0 }}
                        >
                          <Button
                            size="small"
                            icon={<EyeOutlined />}
                            onClick={() => handleViewDetail(task)}
                          >
                            查看详情
                          </Button>
                        </Space>
                      </div>
                    </Card>
                  ))}
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
      </div>
      <TaskCreationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </DashboardLayout>
  );
}

