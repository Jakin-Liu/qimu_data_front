'use client';

import { Card, Typography, Empty } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';

const { Title } = Typography;

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <SettingOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: 12 }} />
          <Title level={2} style={{ display: 'inline', margin: 0 }}>
            系统设置
          </Title>
        </div>
        <Empty description="系统设置功能开发中..." />
      </Card>
    </DashboardLayout>
  );
}

