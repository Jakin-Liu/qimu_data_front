'use client';

import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Layout,
  Menu,
  Avatar,
  Dropdown,
  Button,
  Typography,
  theme,
} from 'antd';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  ShopOutlined,
  UserOutlined,
  SettingOutlined,
  DashboardOutlined,
  LogoutOutlined,
  BarChartOutlined,
  BankOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [username, setUsername] = useState<string | null>(null);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    // 检查登录状态
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      router.push('/login');
      return;
    }
    
    // 获取用户名
    const user = localStorage.getItem('username');
    setUsername(user);
  }, [router]);

  // 菜单项配置
  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: '首页',
    },
    {
      key: '/merchant',
      icon: <ShopOutlined />,
      label: '商户管理',
    },
    {
      key: '/user',
      icon: <UserOutlined />,
      label: '用户管理',
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: '运营数据',
      children: [
        {
          key: '/statistics/market-income',
          label: '市场收入统计',
        },
        {
          key: '/statistics/link-data',
          label: '链接数据统计',
        },
        {
          key: '/statistics/product-cart',
          label: '产品加购数据',
        },
        {
          key: '/statistics/daily-data',
          label: '每日销售数据',
        },
      ],
    },
    {
      key: '/shop',
      icon: <BankOutlined />,
      label: '商家店铺',
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: '系统设置',
    },
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }: { key: string }) => {
    router.push(key);
  };

  // 处理退出登录
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('username');
    router.push('/login');
  };

  // 用户下拉菜单
  const userMenuItems: MenuProps['items'] = [
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  // 获取当前选中的菜单项和展开的菜单
  const getSelectedKeys = () => {
    if (pathname?.startsWith('/statistics')) {
      return [pathname];
    }
    return [pathname || '/'];
  };

  const getOpenKeys = () => {
    if (pathname?.startsWith('/statistics')) {
      return ['/statistics'];
    }
    return [];
  };

  const [openKeys, setOpenKeys] = useState<string[]>(getOpenKeys());
  const selectedKeys = getSelectedKeys();

  // 当pathname变化时，更新openKeys
  useEffect(() => {
    setOpenKeys(getOpenKeys());
  }, [pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        style={{
          overflow: 'auto',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        theme="dark"
      >
        <div
          style={{
            height: 64,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            color: 'white',
            fontSize: collapsed ? 20 : 18,
            fontWeight: 'bold',
          }}
        >
          {collapsed ? '七木' : '七木数据管理系统'}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={selectedKeys}
          openKeys={openKeys}
          onOpenChange={setOpenKeys}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: 'all 0.2s' }}>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: 16,
              width: 64,
              height: 64,
            }}
          />
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: 8,
                transition: 'background 0.3s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f5f5f5';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              <Avatar
                style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                icon={<UserOutlined />}
              />
              <Text strong>{username || '用户'}</Text>
            </div>
          </Dropdown>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}

