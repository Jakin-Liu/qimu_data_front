'use client';

import { useState } from 'react';
import { Button, Space, Tabs, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';
import TikTokReviewTaskList from '@/components/TikTokReviewTaskList';
import TikTokReviewCreationDialog from '@/components/TikTokReviewCreationDialog';

const { Title } = Typography;

type FilterStatus = 'all' | 'pending' | 'processing' | 'completed' | 'failed';

export default function TikTokReviewsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');

  const tabItems = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '等待中' },
    { key: 'processing', label: '处理中' },
    { key: 'completed', label: '已完成' },
    { key: 'failed', label: '失败' },
  ];

  return (
    <DashboardLayout>
      <Space orientation="vertical" size="large" style={{ width: '100%' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Title level={2} style={{ margin: 0 }}>
            TK 商品评论任务管理
          </Title>
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Tabs
            activeKey={filterStatus}
            onChange={(key) => setFilterStatus(key as FilterStatus)}
            items={tabItems}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setIsDialogOpen(true)}
          >
            新建任务
          </Button>
        </div>
        <TikTokReviewTaskList filterStatus={filterStatus} />
      </Space>
      <TikTokReviewCreationDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
      />
    </DashboardLayout>
  );
}

