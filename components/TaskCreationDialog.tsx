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
    urls?: string; 
    remark?: string;
  }) => {
    if (values.taskType === 'qianyi_sync') {
      // 千易订单同步任务不需要URL
      setIsSubmitting(true);
      try {
        // Mock API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const taskId = `qianyi-sync-${Date.now()}`;
        message.success(`千易订单同步任务创建成功，任务ID: ${taskId}`);
        form.resetFields();
        onOpenChange(false);
        window.dispatchEvent(new CustomEvent('task-created'));
      } catch (error) {
        message.error('创建任务失败');
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // TikTok评论爬虫和FastMoss爬虫任务需要URL
      if (!values.urls) {
        message.error('请输入至少一个URL');
        return;
      }

    const urls = values.urls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url !== '');

    if (urls.length === 0) {
      message.error('请至少添加一个URL');
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
        const taskId = `${values.taskType}-${Date.now()}`;
        const taskTypeName = values.taskType === 'tiktok_review' ? 'TikTok评论爬虫' : 'FastMoss爬虫';
        message.success(`${taskTypeName}任务创建成功，任务ID: ${taskId}`);
      form.resetFields();
      onOpenChange(false);
      window.dispatchEvent(new CustomEvent('task-created'));
    } catch (error) {
      message.error('创建任务失败');
    } finally {
      setIsSubmitting(false);
      }
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

