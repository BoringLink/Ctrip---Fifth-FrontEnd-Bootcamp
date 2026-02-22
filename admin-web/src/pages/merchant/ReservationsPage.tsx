import { useEffect, useState } from 'react'
import { Table, Tag, Button, Space, App } from 'antd'
import { reservationsApi } from '../../api/reservations'
import type { Reservation, ReservationStatus } from '../../types'

const statusMap: Record<ReservationStatus, { color: string; text: string }> = {
  confirmed: { color: 'blue', text: '已确认' },
  check_in: { color: 'green', text: '已入住' },
  check_out: { color: 'default', text: '已退房' },
  cancelled: { color: 'red', text: '已取消' },
}

export default function ReservationsPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(false)
  const { message } = App.useApp()

  const load = async () => {
    setLoading(true)
    try {
      const res = await reservationsApi.getAll()
      setReservations(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleAction = async (action: 'checkIn' | 'checkOut' | 'cancel', id: string) => {
    try {
      if (action === 'checkIn') await reservationsApi.checkIn(id)
      else if (action === 'checkOut') await reservationsApi.checkOut(id)
      else await reservationsApi.cancel(id)
      message.success('操作成功')
      load()
    } catch (e: any) {
      message.error(e.response?.data?.message || '操作失败')
    }
  }

  return (
    <div>
      <h2>预订管理</h2>
      <Table
        loading={loading}
        dataSource={reservations}
        rowKey="id"
        columns={[
          { title: '预订ID', dataIndex: 'id', ellipsis: true, width: 120 },
          { title: '客人姓名', dataIndex: 'guestName' },
          { title: '联系电话', dataIndex: 'guestPhone' },
          { title: '入住日期', dataIndex: 'checkInDate', render: (v) => v?.slice(0, 10) },
          { title: '离店日期', dataIndex: 'checkOutDate', render: (v) => v?.slice(0, 10) },
          { title: '总价', dataIndex: 'totalPrice', render: (v) => `¥${v}` },
          {
            title: '状态', dataIndex: 'status', width: 100,
            render: (s: ReservationStatus) => <Tag color={statusMap[s].color}>{statusMap[s].text}</Tag>,
          },
          {
            title: '操作', key: 'action', width: 200,
            render: (_, r) => (
              <Space>
                {r.status === 'confirmed' && (
                  <Button size="small" type="primary" onClick={() => handleAction('checkIn', r.id)}>入住</Button>
                )}
                {r.status === 'check_in' && (
                  <Button size="small" onClick={() => handleAction('checkOut', r.id)}>退房</Button>
                )}
                {(r.status === 'confirmed') && (
                  <Button size="small" danger onClick={() => handleAction('cancel', r.id)}>取消</Button>
                )}
              </Space>
            ),
          },
        ]}
      />
    </div>
  )
}
