import { useEffect, useState } from 'react'
import { Descriptions, Tag, Button, Alert, Table, Space } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { hotelsApi } from '../../api/hotels'
import type { Hotel, HotelStatus } from '../../types'

const statusMap: Record<HotelStatus, { color: string; text: string }> = {
  pending: { color: 'orange', text: '待审核' },
  approved: { color: 'green', text: '已上线' },
  rejected: { color: 'red', text: '已拒绝' },
  offline: { color: 'default', text: '已下线' },
}

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    hotelsApi.getById(id!).then((res) => setHotel(res.data))
  }, [id])

  if (!hotel) return null

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/merchant/hotels')}>返回列表</Button>
        <Button type="primary" onClick={() => navigate(`/merchant/hotels/${id}/edit`)}>编辑</Button>
      </Space>

      {hotel.status === 'rejected' && (
        <Alert type="error" message={`审核拒绝原因：${hotel.rejectionReason}`} style={{ marginBottom: 16 }} />
      )}

      <Descriptions title="基本信息" bordered column={2}>
        <Descriptions.Item label="中文名">{hotel.nameZh}</Descriptions.Item>
        <Descriptions.Item label="英文名">{hotel.nameEn}</Descriptions.Item>
        <Descriptions.Item label="地址" span={2}>{hotel.address}</Descriptions.Item>
        <Descriptions.Item label="星级">{hotel.starRating} 星</Descriptions.Item>
        <Descriptions.Item label="状态">
          <Tag color={statusMap[hotel.status].color}>{statusMap[hotel.status].text}</Tag>
        </Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>{hotel.description || '—'}</Descriptions.Item>
      </Descriptions>

      <h3 style={{ marginTop: 24 }}>房型列表</h3>
      <Table
        dataSource={hotel.rooms || []}
        rowKey="id"
        size="small"
        pagination={false}
        columns={[
          { title: '房型名称', dataIndex: 'name' },
          { title: '价格', dataIndex: 'price', render: (v) => `¥${v}` },
          { title: '容纳人数', dataIndex: 'capacity' },
          { title: '房间数量', dataIndex: 'quantity' },
          { title: '描述', dataIndex: 'description', render: (v) => v || '—' },
        ]}
      />

      <h3 style={{ marginTop: 24 }}>设施列表</h3>
      <Table
        dataSource={hotel.facilities || []}
        rowKey="id"
        size="small"
        pagination={false}
        columns={[
          { title: '设施名称', dataIndex: 'name' },
          { title: '分类', dataIndex: 'category', render: (v) => v || '—' },
        ]}
      />
    </div>
  )
}
