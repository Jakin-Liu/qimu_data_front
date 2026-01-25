'use client';

import { useState } from 'react';
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
} from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import type { Dayjs } from 'dayjs';
import DashboardLayout from '@/components/DashboardLayout';
import TaskCreationDialog from '@/components/TaskCreationDialog';
const { RangePicker } = DatePicker;

type TaskStatus = 'all' | 'pending' | 'processing' | 'completed' | 'failed';
type TaskType = 'all' | 'sync_order' | 'data_collection' | 'review_task';

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
      // 使用dayjs方法处理日期
      const startDate = values.dateRange[0].startOf('day');
      const endDate = values.dateRange[1].endOf('day');
      params.startTime = startDate.toISOString();
      params.endTime = endDate.toISOString();
    }
    
    if (values.status && values.status !== 'all') {
      params.status = values.status;
    }
    
    setQueryParams(params);
    message.success('查询条件已应用');
    // TODO: 这里可以调用API获取任务列表
    console.log('查询参数:', params);
  };

  // 重置查询条件
  const handleReset = () => {
    form.resetFields();
    setQueryParams({});
    message.info('查询条件已重置');
    // TODO: 这里可以重新获取所有任务列表
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
                        { value: 'sync_order', label: '同步订单' },
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
        </Space>
      </div>
      <TaskCreationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </DashboardLayout>
  );
}

