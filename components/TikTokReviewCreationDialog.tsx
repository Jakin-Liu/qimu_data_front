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
} from 'antd';
import { PlusOutlined, LoadingOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

interface TikTokReviewCreationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TikTokReviewCreationDialog({
  open,
  onOpenChange,
}: TikTokReviewCreationDialogProps) {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 使用 useWatch 监听表单值变化
  const urlsValue = Form.useWatch('urls', form);
  
  const urlCount = open && urlsValue
    ? urlsValue
        .split('\n')
        .filter((url: string) => url.trim() !== '').length
    : 0;

  const handleSubmit = async (values: { urls: string; remark?: string }) => {
    const urls = values.urls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url !== '');

    if (urls.length === 0) {
      message.error('请至少添加一个TikTok商品URL');
      return;
    }

    // 验证URL格式
    const tiktokShopUrlPattern = /^https:\/\/(shop|www)\.tiktok\.com\/view\/product\/\d+/;
    const invalidUrls = urls.filter((url) => {
      const urlWithoutQuery = url.split('?')[0];
      return !tiktokShopUrlPattern.test(urlWithoutQuery);
    });

    if (invalidUrls.length > 0) {
      message.error(
        `以下URL格式不正确，请使用TikTok Shop商品链接：\n${invalidUrls.join('\n')}`
      );
      return;
    }

    setIsSubmitting(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      const taskId = `tiktok-task-${Date.now()}`;
      message.success(`任务创建成功，任务ID: ${taskId}`);
      form.resetFields();
      onOpenChange(false);
      window.dispatchEvent(new CustomEvent('tiktok-review-task-created'));
    } catch (error) {
      message.error('创建任务失败');
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

  return (
    <Modal
      title={
        <Space>
          <PlusOutlined style={{ color: '#1890ff' }} />
          <span style={{ fontSize: 18, fontWeight: 'bold' }}>
            创建TK评论爬虫任务
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
          label={
            <Space>
              <span>TikTok Shop商品URLs</span>
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
            placeholder="每行输入一个TikTok Shop商品URL&#10;https://shop.tiktok.com/view/product/1730584769274152937?region=MY&locale=en&#10;https://shop.tiktok.com/view/product/1234567890123456789?region=MY&locale=en"
            style={{ fontFamily: 'monospace', fontSize: 12 }}
          />
        </Form.Item>
        <div style={{ marginBottom: 16 }}>
          <Text type="secondary" style={{ fontSize: 12 }}>
            • 每行输入一个TikTok Shop商品URL
            <br />• 支持同时处理多个商品页面
            <br />• URL格式：https://shop.tiktok.com/view/product/商品ID
          </Text>
        </div>

        <Form.Item label="任务备注（可选）" name="remark">
          <TextArea
            rows={4}
            placeholder="为这个任务添加备注信息，比如：&#10;• 测试环境数据抓取&#10;• 重点关注高评分评论&#10;• 仅抓取前100条评论"
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

