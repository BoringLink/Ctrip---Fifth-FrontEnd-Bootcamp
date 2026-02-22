import { useEffect, useState } from 'react'
import { Descriptions, Button, Space, Modal, Input, Table, App, Tag } from 'antd'
import { useNavigate, useParams } from 'react-router-dom'
import { hotelsApi } from '../../api/hotels'
import type { Hotel } from '../../types'

export default function ReviewDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [rejectVisible, setRejectVisible] = useState(false)
  const [reason, setReason] = useState('')
  const navigate = useNavigate()
  const { message } = App.useApp()

  useEffect(() => {
    hotelsApi.getById(id!).then((res) => setHotel(res.data))
  }, [id])

  const handleApprove = async () => {
    try {
      await hotelsApi.approve(id!)
      message.success('已通过审核')
      navigate('/admin/review')
    } catch {
      message.error('操作失败')
    }
  }

  const handleReject = async () => {
    if (!reason.trim()) return message.warning('请填写拒绝原因')
    try {
      await hotelsApi.reject(id!, reason)
      message.success('已拒绝')
      navigate('/admin/review')
    } catch {
      message.error('操作失败')
    }
  }

  const handleOffline = async () => {
    try {
      await hotelsApi.offline(id!)
      message.success('已下线')
      navigate('/admin/review')
    } catch {
      message.error('操作失败')
    }
  }

  if (!hotel) return null

  return (
    <div>
      <Space style={{ marginBottom: 16 }}>
        <Button onClick={() => navigate('/admin/review')}>返回列表</Button>
        <Button type="primary" onClick={handleApprove}>通过</Button>
        <Button danger onClick={() => setRejectVisible(true)}>拒绝</Button>
        <Button onClick={handleOffline}>下线</Button>
      </Space>

      <Descriptions title="酒店基本信息" bordered column={2}>
        <Descriptions.Item label="中文名">{hotel.nameZh}</Descriptions.Item>
        <Descriptions.Item label="英文名">{hotel.nameEn}</Descriptions.Item>
        <Descriptions.Item label="地址" span={2}>{hotel.address}</Descriptions.Item>
        <Descriptions.Item label="星级">{hotel.starRating} 星</Descriptions.Item>
        <Descriptions.Item label="开业时间">{hotel.openingDate?.slice(0, 10)}</Descriptions.Item>
        <Descriptions.Item label="描述" span={2}>{hotel.description || '—'}</Descriptions.Item>
      </Descriptions>

      <h3 style={{ marginTop: 24 }}>房型</h3>
      <Table
        dataSource={hotel.rooms || []}
        rowKey="id"
        size="small"
        pagination={false}
        columns={[
          { title: '名称', dataIndex: 'name' },
          { title: '价格', dataIndex: 'price', render: (v) => `¥${v}` },
          { title: '容纳人数', dataIndex: 'capacity' },
          { title: '数量', dataIndex: 'quantity' },
        ]}
      />

      <h3 style={{ marginTop: 24 }}>设施</h3>
      <Space wrap>
        {(hotel.facilities || []).map((f) => <Tag key={f.id}>{f.name}</Tag>)}
      </Space>

      <Modal
        title="填写拒绝原因"
        open={rejectVisible}
        onOk={handleReject}
        onCancel={() => setRejectVisible(false)}
        okText="确认拒绝"
        okButtonProps={{ danger: true }}
      >
        <Input.TextArea
          rows={4}
          placeholder="请输入拒绝原因"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
        />
      </Modal>
    </div>
  )
}
