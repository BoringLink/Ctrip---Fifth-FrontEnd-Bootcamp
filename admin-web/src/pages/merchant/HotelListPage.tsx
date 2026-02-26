import { useEffect, useState } from 'react'
import { Table, Button, Tag, Space, Popconfirm, App } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { hotelsApi } from '../../api/hotels'
import type { Hotel, HotelStatus } from '../../types'

const statusMap: Record<HotelStatus, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待审核' },
  approved: { color: 'green', text: '已上线' },
  rejected: { color: 'red', text: '已拒绝' },
  offline: { color: 'default', text: '已下线' },
}

export default function HotelListPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { message } = App.useApp()

  const load = async () => {
    setLoading(true)
    try {
      const res = await hotelsApi.getMerchantHotels()
      setHotels(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleDelete = async (id: string) => {
    try {
      await hotelsApi.remove(id)
      message.success('删除成功')
      load()
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>我的酒店</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => navigate('/merchant/hotels/new')}>
          添加酒店
        </Button>
      </div>
      <Table
        loading={loading}
        dataSource={hotels}
        rowKey="id"
        columns={[
          { title: '酒店名称', dataIndex: 'nameZh', key: 'nameZh' },
          { title: '地址', dataIndex: 'address', key: 'address', ellipsis: true },
          { title: '星级', dataIndex: 'starRating', key: 'starRating', width: 80, render: (v) => `${v}星` },
          {
            title: '状态', dataIndex: 'status', key: 'status', width: 100,
            render: (s: HotelStatus) => <Tag color={statusMap[s].color}>{statusMap[s].text}</Tag>,
          },
          {
            title: '操作', key: 'action', width: 180,
            render: (_, record) => (
              <Space>
                <Button size="small" onClick={() => navigate(`/merchant/hotels/${record.id}`)}>详情</Button>
                <Button size="small" onClick={() => navigate(`/merchant/hotels/${record.id}/edit`)}>编辑</Button>
                <Popconfirm title="确认删除？" onConfirm={() => handleDelete(record.id)}>
                  <Button size="small" danger>删除</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
    </div>
  )
}
