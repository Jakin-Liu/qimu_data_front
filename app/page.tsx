'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, Typography, Space, Button } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Title, Paragraph } = Typography;

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    router.push('/login');
  };

  const username = typeof window !== 'undefined' ? localStorage.getItem('username') : null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-6xl mx-auto">
        <Card
          className="shadow-lg"
          style={{
            borderRadius: '16px',
          }}
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <Title level={2} className="mb-2">
                欢迎，{username || '用户'}！
              </Title>
              <Paragraph className="text-gray-600">
                您已成功登录系统
              </Paragraph>
            </div>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              size="large"
            >
              退出登录
            </Button>
          </div>

          <Space orientation="vertical" size="large" className="w-full">
            <Card
              title="系统信息"
              variant="borderless"
              style={{
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
              }}
              styles={{
                header: { color: 'white', borderBottom: '1px solid rgba(255,255,255,0.2)' }
              }}
            >
              <div className="text-white">
                <p className="text-lg mb-2">
                  <UserOutlined className="mr-2" />
                  当前用户：{username || 'admin'}
                </p>
                <p className="text-lg">
                  登录状态：已登录
                </p>
              </div>
            </Card>

            <Card
              title="功能模块"
              variant="borderless"
              style={{ borderRadius: '12px' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                  hoverable
                  className="text-center"
                  style={{ borderRadius: '8px' }}
                >
                  <Title level={4}>数据管理</Title>
                  <Paragraph className="text-gray-500">
                    管理和查看系统数据
                  </Paragraph>
                </Card>
                <Card
                  hoverable
                  className="text-center"
                  style={{ borderRadius: '8px' }}
                >
                  <Title level={4}>用户管理</Title>
                  <Paragraph className="text-gray-500">
                    管理系统用户信息
                  </Paragraph>
                </Card>
                <Card
                  hoverable
                  className="text-center"
                  style={{ borderRadius: '8px' }}
                >
                  <Title level={4}>系统设置</Title>
                  <Paragraph className="text-gray-500">
                    配置系统参数
                  </Paragraph>
                </Card>
              </div>
            </Card>
          </Space>
        </Card>
      </div>
    </div>
  );
}
