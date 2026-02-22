import { Form, Input, Button, Card, Typography, Select, App } from 'antd'
import { useNavigate, Link } from 'react-router-dom'
import { authApi } from '../../api/auth'

const { Title } = Typography

export default function RegisterPage() {
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const onFinish = async (values: {
    email: string
    password: string
    name: string
    role: 'merchant' | 'admin'
  }) => {
    try {
      await authApi.register(values)
      message.success('注册成功，请登录')
      navigate('/login')
    } catch (e: any) {
      message.error(e.response?.data?.message || '注册失败')
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f2f5' }}>
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: 'center', marginBottom: 24 }}>易宿管理平台 — 注册</Title>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
            <Input placeholder="请输入姓名" />
          </Form.Item>
          <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
            <Input placeholder="请输入邮箱" />
          </Form.Item>
          <Form.Item name="password" label="密码" rules={[{ required: true, min: 6 }]}>
            <Input.Password placeholder="请输入密码（至少6位）" />
          </Form.Item>
          <Form.Item name="role" label="角色" rules={[{ required: true }]}>
            <Select placeholder="请选择角色">
              <Select.Option value="merchant">商户</Select.Option>
              <Select.Option value="admin">管理员</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>注册</Button>
          </Form.Item>
          <div style={{ textAlign: 'center' }}>
            已有账号？<Link to="/login">立即登录</Link>
          </div>
        </Form>
      </Card>
    </div>
  )
}
