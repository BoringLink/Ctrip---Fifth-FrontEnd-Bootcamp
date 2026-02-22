import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { login } from '../lib/api';
import { setToken, setUser } from '../lib/auth';
import {
  Form, Input, Button, Card, Typography,
  Layout, Alert, Space
} from 'antd';
import { UserOutlined, LockOutlined, FontColorsOutlined } from '@ant-design/icons';

const { Title } = Typography;
const { Content } = Layout;

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [form] = Form.useForm();

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    setError('');
    try {
      const data = await login(values);
      setToken(data.token);
      setUser(data.user);
      // 根据角色跳转
      if (data.user.role === 'merchant') {
        router.push('/merchant/hotels');
      } else {
        router.push('/admin/audits');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || '登录失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh', background: '#f5f5f5' }}>
      <Content style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '50px 0'
      }}>
        <Card
          style={{ width: 400, boxShadow: '0 2px 12px rgba(0,0,0,0.1)' }}
          title={<Title level={2} style={{ textAlign: 'center' }} >易宿酒店管理系统</Title>}
        >
          <Title level={4} style={{ marginBottom: 24, textAlign: 'center' }}>登录</Title>

          {error && (
            <Alert
              message={error}
              type="error"
              showIcon
              style={{ marginBottom: 16 }}
            />
          )}

          <Form
            form={form}
            name="login"
            onFinish={handleSubmit}
            initialValues={{ remember: true }}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: '请输入邮箱!' }, { type: 'email', message: '请输入有效的邮箱!' }]}
            >
              <Input
                prefix={<UserOutlined className="site-form-item-icon" />}
                placeholder="邮箱"
                autoComplete="email"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[{ required: true, message: '请输入密码!' }]}
            >
              <Input.Password
                prefix={<LockOutlined className="site-form-item-icon" />}
                type="password"
                placeholder="密码"
                autoComplete="current-password"
              />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                block
                size="large"
              >
                登录
              </Button>
            </Form.Item>
          </Form>

          <Space style={{ display: 'flex', justifyContent: 'center' }}>
            <span>没有账号？</span>
            <Link href="/register">
              <Button type="text">立即注册</Button>
            </Link>
          </Space>
        </Card>
      </Content>
    </Layout>
  );
}