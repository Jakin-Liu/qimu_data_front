'use client';

import { useState } from 'react';
import {
  Typography,
  Space,
  Row,
  Col,
  Button,
  message,
} from 'antd';
import { SyncOutlined, UnorderedListOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import { syncQianyiOrders } from '@/lib/api/order';

const { Title } = Typography;

export default function TaskPage() {
  const [syncing, setSyncing] = useState(false);

  // 同步订单
  const handleSyncOrders = async () => {
    try {
      setSyncing(true);
      
      const response = await syncQianyiOrders({});
      
      // 处理不同的响应结构
      const success = response.data?.success ?? response.success ?? false;
      const count = response.data?.count ?? response.count ?? 0;
      const msg = response.data?.message ?? response.message ?? '';

      if (success) {
        message.success(`订单同步成功，共同步 ${count} 条订单数据`);
      } else {
        if (msg) {
          message.warning(msg);
        } else {
          message.warning('同步完成，但未返回成功状态');
        }
      }
    } catch (error: any) {
      message.error(error.message || '同步订单失败');
    } finally {
      setSyncing(false);
    }
  };

  return (
    <DashboardLayout>
      <div>
        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          {/* 页面标题和操作栏 */}
          <Row justify="space-between" align="middle">
            <Col>
              <Space align="center">
                <UnorderedListOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                <Title level={2} style={{ margin: 0 }}>
                  任务管理
                </Title>
              </Space>
            </Col>
            <Col>
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={handleSyncOrders}
                loading={syncing}
              >
                同步订单
              </Button>
            </Col>
          </Row>
        </Space>
      </div>
    </DashboardLayout>
  );
}

