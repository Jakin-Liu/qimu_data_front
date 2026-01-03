'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { FormProps } from 'antd';

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onFinish: FormProps<LoginForm>['onFinish'] = async (values) => {
    setLoading(true);
    
    // 模拟验证延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 验证账号密码
    if (values.username === 'admin' && values.password === '123456') {
      message.success('登录成功！');
      // 可以在这里存储登录状态到 localStorage 或 sessionStorage
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('username', values.username);
      
      // 跳转到首页
      router.push('/');
    } else {
      message.error('账号或密码错误！');
      setLoading(false);
    }
  };

  const onFinishFailed: FormProps<LoginForm>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Card
        className="w-full max-w-md shadow-2xl"
        variant="borderless"
        style={{
          borderRadius: '16px',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
        }}
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">欢迎登录</h1>
          <p className="text-gray-500">请输入您的账号和密码</p>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          size="large"
          layout="vertical"
        >
          <Form.Item<LoginForm>
            label="账号"
            name="username"
            rules={[
              { required: true, message: '请输入账号!' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="请输入账号"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item<LoginForm>
            label="密码"
            name="password"
            rules={[
              { required: true, message: '请输入密码!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="请输入密码"
              style={{ borderRadius: '8px' }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              block
              style={{
                height: '48px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: 'none',
              }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>

        <div className="text-center mt-6 text-sm text-gray-500">
          <p>默认账号：admin / 123456</p>
        </div>
      </Card>
    </div>
  );
}

