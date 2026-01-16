'use client';

import { Card, Typography, Empty } from 'antd';
import { TeamOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';

const { Title } = Typography;

export default function UserPage() {
  return (
    <DashboardLayout>
      <Card>
        <div style={{ marginBottom: 24 }}>
          <TeamOutlined style={{ fontSize: '24px', color: '#1890ff', marginRight: 12 }} />
          <Title level={2} style={{ display: 'inline', margin: 0 }}>
            用户管理
          </Title>
        </div>
        <Empty description="用户管理功能开发中..." />
      </Card>
    </DashboardLayout>
  );
}

