'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Card,
  Button,
  Space,
  Typography,
  Tooltip,
  Spin,
  Empty,
  message,
  Pagination,
  Tag,
  Form,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
} from 'antd';
import {
  EyeOutlined,
  CopyOutlined,
  CheckOutlined,
  ReloadOutlined,
  UserOutlined,
  ShopOutlined,
  SettingOutlined,
  CodeOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { Task, TaskListResponse, ApiResponse } from '@/lib/types/task';
import { get } from '@/lib/api';
import type { Dayjs } from 'dayjs';
import TaskDefinitionDetailDrawer from '@/components/TaskDefinitionDetailDrawer';

const { Text } = Typography;
const { RangePicker } = DatePicker;

interface TaskListProps {
  filterStatus: 'all' | 'pending' | 'processing' | 'completed' | 'failed';
}

interface FilterParams {
  taskDefinitionId?: string;
  excutor?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
}

export default function TaskList({ filterStatus }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copiedTasks, setCopiedTasks] = useState<Set<number>>(new Set());
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filterParams, setFilterParams] = useState<FilterParams>({});
  const [form] = Form.useForm();
  const [detailDrawerOpen, setDetailDrawerOpen] = useState(false);
  const [selectedDefinitionId, setSelectedDefinitionId] = useState<string | null>(null);
  const router = useRouter();

  const fetchTasks = async (page = 1, pageSize = 10, filters?: FilterParams) => {
    console.log('🔍 [fetchTasks] 函数被调用，参数:', { page, pageSize, filters });
    
    try {
      console.log('⏳ [fetchTasks] 设置 loading 状态为 true');
      setIsLoading(true);
      
      // 构建查询参数
      const params: Record<string, any> = {
        page,
        pageSize,
      };

      // 添加筛选参数
      const activeFilters = filters || filterParams;
      console.log('📊 [fetchTasks] 活动筛选器:', activeFilters);
      
      if (activeFilters.taskDefinitionId) {
        params.taskDefinitionId = activeFilters.taskDefinitionId;
      }
      if (activeFilters.excutor) {
        params.excutor = activeFilters.excutor;
      }
      // 将filterStatus映射到status参数
      if (filterStatus !== 'all') {
        params.status = filterStatus;
      } else if (activeFilters.status) {
        params.status = activeFilters.status;
      }
      if (activeFilters.startTime) {
        params.startTime = activeFilters.startTime;
      }
      if (activeFilters.endTime) {
        params.endTime = activeFilters.endTime;
      }

      // 调试日志
      console.log('🔍 [fetchTasks] 发起API请求:', {
        endpoint: '/task/definition/list',
        params,
        fullUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3900'}/api/v1/task/definition/list?${new URLSearchParams(params as any).toString()}`,
      });

      console.log('🌐 [fetchTasks] 准备调用 get() 函数...');
      // 调用真实API
      const apiResponse = await get<ApiResponse<TaskListResponse>>('/task/definition/list', params);
      
      console.log('✅ [fetchTasks] API响应成功:', apiResponse);
      
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
      console.error('❌ [fetchTasks] API请求失败:', error);
      console.error('❌ [fetchTasks] 错误详情:', {
        message: error?.message,
        stack: error?.stack,
        error,
        name: error?.name,
      });
      message.error(error?.message || '获取任务列表失败');
    } finally {
      console.log('⏳ [fetchTasks] 设置 loading 状态为 false');
      setIsLoading(false);
    }
  };

  // 当filterStatus改变时，重置到第一页
  useEffect(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
  }, [filterStatus]);

  useEffect(() => {
    console.log('🔄 [useEffect] 组件挂载或依赖变化，准备调用 fetchTasks');
    console.log('🔄 [useEffect] 当前状态:', {
      current: pagination.current,
      pageSize: pagination.pageSize,
      filterStatus,
      filterParams,
    });
    fetchTasks(pagination.current, pagination.pageSize, filterParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, filterStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks(pagination.current, pagination.pageSize, filterParams);
    }, 5000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, filterStatus]);

  // 监听任务创建事件，刷新列表
  useEffect(() => {
    const handleTaskCreated = () => {
      console.log('🔄 [TaskList] 收到任务创建事件，刷新列表');
      fetchTasks(pagination.current, pagination.pageSize, filterParams);
    };

    window.addEventListener('task-created', handleTaskCreated);
    return () => {
      window.removeEventListener('task-created', handleTaskCreated);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagination.current, pagination.pageSize, filterParams]);

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

  const handleViewDetail = (task: Task) => {
    // 打开右侧抽屉显示详情
    setSelectedDefinitionId(task.definitionId);
    setDetailDrawerOpen(true);
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination((prev) => ({ ...prev, current: page, pageSize }));
  };

  const handleSearch = (values: {
    taskDefinitionId?: string;
    excutor?: string;
    status?: string;
    dateRange?: [Dayjs, Dayjs];
  }) => {
    console.log('🔍 [handleSearch] 开始执行，接收到的值:', values);
    
    try {
      const params: FilterParams = {};
      
      if (values.taskDefinitionId?.trim()) {
        params.taskDefinitionId = values.taskDefinitionId.trim();
      }
      
      if (values.excutor && values.excutor !== 'all') {
        params.excutor = values.excutor;
      }
      
      if (values.status && values.status !== 'all') {
        params.status = values.status;
      }
      
      if (values.dateRange && values.dateRange[0] && values.dateRange[1]) {
        const startDate = values.dateRange[0].startOf('day');
        const endDate = values.dateRange[1].endOf('day');
        params.startTime = startDate.toISOString();
        params.endTime = endDate.toISOString();
      }
      
      console.log('📋 [handleSearch] 构建的查询参数:', params);
      console.log('📋 [handleSearch] 准备调用 fetchTasks，参数:', {
        page: 1,
        pageSize: pagination.pageSize,
        filters: params,
      });
      
      setFilterParams(params);
      setPagination((prev) => ({ ...prev, current: 1 }));
      
      // 立即触发查询
      console.log('🚀 [handleSearch] 准备调用 fetchTasks...');
      console.log('🚀 [handleSearch] fetchTasks 函数类型:', typeof fetchTasks);
      console.log('🚀 [handleSearch] fetchTasks 函数:', fetchTasks);
      
      // 直接调用，不使用 await（因为这是同步函数）
      const fetchPromise = fetchTasks(1, pagination.pageSize, params);
      console.log('🚀 [handleSearch] fetchTasks 调用完成，返回 Promise:', fetchPromise);
      
      // 捕获 Promise 错误
      fetchPromise.catch((error: any) => {
        console.error('❌ [handleSearch] fetchTasks Promise 被拒绝:', error);
        console.error('❌ [handleSearch] 错误堆栈:', error?.stack);
        message.error('查询失败: ' + (error?.message || '未知错误'));
      });
      
      message.success('查询条件已应用');
    } catch (error) {
      console.error('❌ [handleSearch] 执行出错:', error);
      message.error('查询失败，请查看控制台');
    }
  };

  const handleReset = () => {
    form.resetFields();
    const emptyParams: FilterParams = {};
    setFilterParams(emptyParams);
    setPagination((prev) => ({ ...prev, current: 1 }));
    // 立即触发查询
    fetchTasks(1, pagination.pageSize, emptyParams);
    message.info('查询条件已重置');
  };

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      {/* 筛选表单 */}
      <Card>
        <Form
          form={form}
          layout="vertical"
          onFinish={(values) => {
            console.log('📝 表单提交:', values);
            handleSearch(values);
          }}
          onFinishFailed={(errorInfo) => {
            console.error('❌ 表单验证失败:', errorInfo);
          }}
        >
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="taskDefinitionId"
                label="定义ID"
              >
                <Input
                  placeholder="请输入任务定义ID"
                  allowClear
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="excutor"
                label="执行器"
              >
                <Select
                  placeholder="请选择执行器"
                  allowClear
                  options={[
                    { value: 'all', label: '全部' },
                    { value: 'tiktok', label: 'TikTok' },
                    { value: 'fastmoss', label: 'FastMoss' },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="status"
                label="状态"
              >
                <Select
                  placeholder="请选择状态"
                  allowClear
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
            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                name="dateRange"
                label="时间范围"
              >
                <RangePicker
                  showTime
                  format="YYYY-MM-DD HH:mm:ss"
                  placeholder={['开始时间', '结束时间']}
                  style={{ width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col span={24}>
              <Space>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SearchOutlined />}
                >
                  查询
                </Button>
                <Button
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    console.log('🔘 重置按钮被点击');
                    handleReset();
                  }}
                >
                  重置
                </Button>
                <Button 
                  icon={<ReloadOutlined />} 
                  onClick={() => {
                    console.log('🔘 刷新按钮被点击');
                    fetchTasks(pagination.current, pagination.pageSize, filterParams);
                  }}
                  loading={isLoading}
                >
                  刷新
                </Button>
                <Button 
                  type="dashed"
                  onClick={async () => {
                    console.log('🧪 [测试按钮] 开始测试...');
                    console.log('🧪 [测试按钮] fetchTasks 函数:', fetchTasks);
                    console.log('🧪 [测试按钮] 准备直接调用 fetchTasks(1, 10, {})');
                    try {
                      await fetchTasks(1, 10, {});
                      console.log('🧪 [测试按钮] fetchTasks 调用完成');
                    } catch (error) {
                      console.error('🧪 [测试按钮] fetchTasks 调用失败:', error);
                    }
                  }}
                >
                  测试请求
                </Button>
              </Space>
            </Col>
          </Row>
        </Form>
      </Card>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text type="secondary">
          共 {pagination.total} 条任务
        </Text>
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

      {/* 任务定义详情抽屉 */}
      <TaskDefinitionDetailDrawer
        open={detailDrawerOpen}
        definitionId={selectedDefinitionId}
        onClose={() => {
          setDetailDrawerOpen(false);
          setSelectedDefinitionId(null);
        }}
      />
    </Space>
  );
}

