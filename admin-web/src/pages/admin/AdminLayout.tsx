import { Layout, Menu, Button, Typography } from 'antd'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { AuditOutlined, TagsOutlined, LogoutOutlined } from '@ant-design/icons'
import { useAuthStore } from '../../store/auth'

const { Sider, Header, Content } = Layout

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout } = useAuthStore()

  const selectedKey = location.pathname.includes('tags') ? 'tags' : 'review'

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider theme="dark" width={200}>
        <div style={{ padding: '16px', color: '#fff', fontWeight: 'bold', fontSize: 16 }}>易宿管理员端</div>
        <Menu
          theme="dark"
          selectedKeys={[selectedKey]}
          items={[
            { key: 'review', icon: <AuditOutlined />, label: '酒店审核', onClick: () => navigate('/admin/review') },
            { key: 'tags', icon: <TagsOutlined />, label: '标签管理', onClick: () => navigate('/admin/tags') },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 12 }}>
          <Typography.Text>欢迎，{user?.name}</Typography.Text>
          <Button icon={<LogoutOutlined />} onClick={() => { logout(); navigate('/login') }}>退出</Button>
        </Header>
        <Content style={{ margin: 24, background: '#fff', padding: 24, borderRadius: 8 }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
