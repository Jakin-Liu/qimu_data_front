'use client';

import { useState } from 'react';
import {
  Modal,
  Form,
  Input,
  Button,
  Space,
  Typography,
  message,
  Select,
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';
import { post } from '@/lib/api';
import type { ApiResponse, CreateTaskDefinitionDto, SplitStrategy } from '@/lib/types/task';

const { TextArea } = Input;
const { Text } = Typography;

interface TaskCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TaskType = 'qianyi_sync' | 'tiktok_review' | 'fastmoss_crawl';

export default function TaskCreationDialog({
  open,
  onOpenChange,
}: TaskCreationDialogProps) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 使用 useWatch 监听表单值变化
  const taskType = Form.useWatch('taskType', form);
  const urlsValue = Form.useWatch('urls', form);
  
  const urlCount = open && urlsValue
    ? urlsValue
        .split('\n')
        .filter((url: string) => url.trim() !== '').length
    : 0;

  const handleSubmit = async (values: { 
    taskType: TaskType;
    name?: string;
    urls?: string; 
    remark?: string;
  }) => {
    setIsSubmitting(true);
    try {
      // 根据任务类型确定拆分策略
      // 有 URLs 的任务使用 url_list，其他使用 page
      const splitStrategy: SplitStrategy = 
        (values.taskType === 'fastmoss_crawl' || values.taskType === 'tiktok_review') 
          ? 'url_list' 
          : 'page';

      // 构建任务定义数据
      const taskDefinitionData: CreateTaskDefinitionDto = {
        name: values.name || `任务_${Date.now()}`,
        description: values.remark || undefined,
        splitStrategy: splitStrategy,
      };

      // 根据任务类型设置配置
      if (values.taskType === 'qianyi_sync') {
        // 千易订单同步任务 - 不需要 config
        taskDefinitionData.config = undefined;
      } else if (values.taskType === 'fastmoss_crawl') {
        // FastMoss爬虫任务需要URL
        if (!values.urls) {
          message.error('请输入至少一个URL');
          setIsSubmitting(false);
          return;
        }

        const urls = values.urls
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => url !== '');

        if (urls.length === 0) {
          message.error('请至少添加一个URL');
          setIsSubmitting(false);
          return;
        }

        // 将 URLs 保存到 config.urls
        taskDefinitionData.config = {
          urls: urls,
        };
      } else if (values.taskType === 'tiktok_review') {
        // TikTok评论爬虫任务需要URL
        if (!values.urls) {
          message.error('请输入至少一个URL');
          setIsSubmitting(false);
          return;
        }

        const urls = values.urls
          .split('\n')
          .map((url) => url.trim())
          .filter((url) => url !== '');

        if (urls.length === 0) {
          message.error('请至少添加一个URL');
          setIsSubmitting(false);
          return;
        }

        // TikTok 任务可能也需要类似的配置结构
        taskDefinitionData.config = {
          urls: urls,
        };
      }

      console.log('📤 创建任务定义，提交数据:', taskDefinitionData);

      // 调用创建任务定义的API
      const response = await post<ApiResponse<any>>('/task/definition', taskDefinitionData);

      console.log('✅ 创建任务定义响应:', response);

      if (response.code !== 0) {
        throw new Error(response.message || '创建任务失败');
      }

      const taskTypeName = 
        values.taskType === 'qianyi_sync' ? '千易订单同步' :
        values.taskType === 'tiktok_review' ? 'TikTok评论爬虫' :
        'FastMoss爬虫';
      
      message.success(`${taskTypeName}任务定义创建成功`);
      form.resetFields();
      onOpenChange(false);
      window.dispatchEvent(new CustomEvent('task-created'));
    } catch (error: any) {
      console.error('❌ 创建任务定义失败:', error);
      message.error(error?.message || '创建任务失败');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleAfterClose = () => {
    form.resetFields();
  };

  // 当任务类型改变时，重置URL字段
  const handleTaskTypeChange = () => {
    form.setFieldValue('urls', undefined);
  };

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>
            创建任务
          </span>
        </Space>
      }
      open={open}
      onCancel={handleCancel}
      afterClose={handleAfterClose}
      footer={null}
      width={600}
    >
      {open && (
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 24 }}
        >
        <Form.Item
          label="任务类型"
          name="taskType"
          rules={[{ required: true, message: '请选择任务类型' }]}
        >
          <Select
            placeholder="请选择要创建的任务类型"
            onChange={handleTaskTypeChange}
            options={[
              { value: 'qianyi_sync', label: '千易订单同步任务' },
              { value: 'tiktok_review', label: 'TikTok评论爬虫任务' },
              { value: 'fastmoss_crawl', label: 'FastMoss爬虫任务' },
            ]}
          />
        </Form.Item>

        <Form.Item
          label="任务名称"
          name="name"
          rules={[{ required: true, message: '请输入任务名称' }]}
        >
          <Input
            placeholder="请输入任务名称"
            allowClear
          />
        </Form.Item>

        {/* 拆分策略 - 写死展示 */}
        {taskType && (
          <Form.Item label="拆分策略">
            <Input
              value={
                taskType === 'fastmoss_crawl' || taskType === 'tiktok_review'
                  ? 'url_list'
                  : 'page'
              }
              disabled
              style={{ background: '#f5f5f5' }}
            />
            <Text type="secondary" style={{ fontSize: 12, display: 'block', marginTop: 4 }}>
              {taskType === 'fastmoss_crawl' || taskType === 'tiktok_review'
                ? '按URL列表拆分任务'
                : '按页面拆分任务'}
            </Text>
          </Form.Item>
        )}

        {taskType && taskType !== 'qianyi_sync' && (
          <>
        <Form.Item
          label={
            <Space>
              <span>目标URLs</span>
              {urlCount > 0 && (
                <Text type="secondary">({urlCount} 个URL)</Text>
              )}
            </Space>
          }
          name="urls"
          rules={[{ required: true, message: '请输入至少一个URL' }]}
        >
          <TextArea
            rows={8}
                placeholder={
                  taskType === 'tiktok_review'
                    ? "每行输入一个TikTok商品页面URL\nhttps://shop.tiktok.com/view/product/123456789\nhttps://shop.tiktok.com/view/product/987654321"
                    : "每行输入一个FastMoss商品页面URL\nhttps://www.fastmoss.com/zh/e-commerce/detail/123456789\nhttps://www.fastmoss.com/zh/e-commerce/detail/987654321"
                }
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
        </Form.Item>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
                {taskType === 'tiktok_review' ? (
                  <>
                    • 每行输入一个TikTok商品页面URL
                    <br />• 支持同时处理多个商品页面
                    <br />• 系统会自动提取商品ID并开始抓取评论数据
                  </>
                ) : (
                  <>
            • 每行输入一个FastMoss商品页面URL
            <br />• 支持同时处理多个商品页面
            <br />• 系统会自动提取商品ID并开始抓取
                  </>
                )}
          </Text>
        </div>
          </>
        )}

        <Form.Item label="任务备注（可选）" name="remark">
          <TextArea
            rows={4}
            placeholder="为这个任务添加备注信息，比如：&#10;• 测试环境数据抓取&#10;• 重点关注销量数据&#10;• 仅抓取前10页数据"
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: 0, marginTop: 24 }}>
          <Space style={{ width: '100%', justifyContent: 'flex-end' }}>
            <Button onClick={handleCancel} disabled={isSubmitting}>
              取消
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={isSubmitting ? <LoadingOutlined /> : <PlusOutlined />}
              loading={isSubmitting}
            >
              创建任务
            </Button>
          </Space>
        </Form.Item>
      </Form>
      )}
    </Modal>
  );
}

