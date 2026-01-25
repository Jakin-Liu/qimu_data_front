'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Layout, Menu, Typography, theme } from 'antd';
import {
  UnorderedListOutlined,
  MessageOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Sider, Content } = Layout;
const { Title, Text } = Typography;

interface TaskLayoutProps {
  children: React.ReactNode;
}

export default function TaskLayout({ children }: TaskLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const menuItems: MenuProps['items'] = [
    {
      key: '/tasks',
      icon: <UnorderedListOutlined />,
      label: 'TK带货达人任务管理',
    },
    {
      key: '/tiktok-reviews',
      icon: <MessageOutlined />,
      label: 'TK 商品评论任务管理',
    },
    {
      key: '/search',
      icon: <SearchOutlined />,
      label: 'TK带货达人数据检索',
    },
  ];

  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  const getSelectedKeys = () => {
    if (pathname === '/tasks' || pathname?.startsWith('/tasks/')) {
      return ['/tasks'];
    }
    if (pathname?.startsWith('/tiktok-reviews')) {
      return ['/tiktok-reviews'];
    }
    if (pathname?.startsWith('/search')) {
      return ['/search'];
    }
    return [pathname || '/tasks'];
  };

  return (
    <Layout style={{ minHeight: '100vh', background: colorBgContainer }}>
      <Sider
        width={256}
        style={{
          background: colorBgContainer,
          borderRight: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid #f0f0f0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <UnorderedListOutlined style={{ fontSize: 20, color: '#1890ff' }} />
            <Title level={4} style={{ margin: 0 }}>
              七木科技后台管理系统
            </Title>
          </div>
          <Text type="secondary" style={{ fontSize: 12 }}>
            任务管理系统
          </Text>
        </div>
        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          onClick={handleMenuClick}
          style={{ borderRight: 0, padding: '8px' }}
        />
      </Sider>
      <Content style={{ flex: 1, overflow: 'auto' }}>
        <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </Content>
    </Layout>
  );
}

