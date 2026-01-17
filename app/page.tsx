'use client';

import { useState, useEffect } from 'react';
import { Card, Typography, Space, Row, Col, Statistic } from 'antd';
import { ShopOutlined, TeamOutlined } from '@ant-design/icons';
import DashboardLayout from '@/components/DashboardLayout';

const { Title } = Typography;

export default function Home() {
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // 只在客户端读取 localStorage
    const user = localStorage.getItem('username');
    setUsername(user);
  }, []);

  return (
    <DashboardLayout>
      <div>
        <Title level={2} style={{ marginBottom: 24 }}>
          欢迎，{username || '用户'}！
        </Title>

        <Space orientation="vertical" size="large" style={{ width: '100%' }}>
          {/* 统计卡片 */}
          <Row gutter={[16, 16]}>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="商户总数"
                  value={0}
                  prefix={<ShopOutlined />}
                  styles={{ content: { color: '#1890ff' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="用户总数"
                  value={0}
                  prefix={<TeamOutlined />}
                  styles={{ content: { color: '#52c41a' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="启用商户"
                  value={0}
                  prefix={<ShopOutlined />}
                  styles={{ content: { color: '#52c41a' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title="停用商户"
                  value={0}
                  prefix={<ShopOutlined />}
                  styles={{ content: { color: '#ff4d4f' } }}
                />
              </Card>
            </Col>
          </Row>
        </Space>
      </div>
    </DashboardLayout>
  );
}
