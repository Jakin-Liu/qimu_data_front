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
  Descriptions,
  Progress,
  Divider,
} from 'antd';
import {
  ArrowLeftOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  LoadingOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import type { SubTask, ApiResponse } from '@/lib/types/task';
import { get } from '@/lib/api';

const { Title, Text } = Typography;

export default function SubTaskDetailPage() {
  const params = useParams();
  const router = useRouter();
  const subTaskId = params.subTaskId as string;

  const [subTask, setSubTask] = useState<SubTask | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // 获取子任务详情
  const fetchSubTask = async () => {
    try {
      setIsLoading(true);
      const response = await get<ApiResponse<SubTask>>(`/sub-task/${subTaskId}`);
      
      if (response.code !== 0) {
        throw new Error(response.message || '获取子任务失败');
      }
      
      setSubTask(response.data);
    } catch (error: any) {
      console.error('获取子任务失败:', error);
      message.error(error?.message || '获取子任务失败');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (subTaskId) {
      fetchSubTask();
    }
  }, [subTaskId]);

  const handleBack = () => {
    if (subTask) {
      router.push(`/task-instance/${subTask.instanceId}`);
    } else {
      router.push('/task-definition');
    }
  };

  const getStatusConfig = (status: SubTask['status']) => {
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

  if (isLoading) {
    return (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <Spin size="large" />
        </div>
      </DashboardLayout>
    );
  }

  if (!subTask) {
    return (
      <DashboardLayout>
        <Empty description="子任务不存在" />
      </DashboardLayout>
    );
  }

  const statusConfig = getStatusConfig(subTask.status);
  const progressPercent =
    subTask.currentPage !== undefined && subTask.totalPages !== undefined
      ? Math.round((subTask.currentPage / subTask.totalPages) * 100)
      : 0;

  return (
    <DashboardLayout>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <Card>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
            <Space>
              <Button icon={<ArrowLeftOutlined />} onClick={handleBack}>
                返回
              </Button>
              <Title level={2} style={{ margin: 0 }}>
                子任务详情
              </Title>
            </Space>
            <Button icon={<ReloadOutlined />} onClick={fetchSubTask}>
              刷新
            </Button>
          </div>

          <Descriptions bordered column={2}>
            <Descriptions.Item label="子任务ID">{subTask.subtaskId}</Descriptions.Item>
            <Descriptions.Item label="实例ID">
              <Text code>{subTask.instanceId}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag icon={statusConfig.icon} color={statusConfig.color}>
                {statusConfig.text}
              </Tag>
            </Descriptions.Item>
            {subTask.url && (
              <Descriptions.Item label="URL" span={2}>
                <Text copyable>{subTask.url}</Text>
              </Descriptions.Item>
            )}
            {subTask.currentPage !== undefined && subTask.totalPages !== undefined && (
              <>
                <Descriptions.Item label="当前页">{subTask.currentPage}</Descriptions.Item>
                <Descriptions.Item label="总页数">{subTask.totalPages}</Descriptions.Item>
                <Descriptions.Item label="进度" span={2}>
                  <Progress percent={progressPercent} status={subTask.status === 'completed' ? 'success' : 'active'} />
                </Descriptions.Item>
              </>
            )}
            {subTask.startedAt && (
              <Descriptions.Item label="开始时间">
                {new Date(subTask.startedAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
            )}
            {subTask.completedAt && (
              <Descriptions.Item label="完成时间">
                {new Date(subTask.completedAt).toLocaleString('zh-CN')}
              </Descriptions.Item>
            )}
            {subTask.errorMessage && (
              <Descriptions.Item label="错误信息" span={2}>
                <Text type="danger">{subTask.errorMessage}</Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="创建时间">
              {new Date(subTask.createdAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
            <Descriptions.Item label="更新时间">
              {new Date(subTask.updatedAt).toLocaleString('zh-CN')}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Space>
    </DashboardLayout>
  );
}

