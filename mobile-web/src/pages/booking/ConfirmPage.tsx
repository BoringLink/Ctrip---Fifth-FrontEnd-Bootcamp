import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavBar, SpinLoading, Tag, Button } from 'antd-mobile'
import { reservationsApi } from '../../api/reservations'
import type { Reservation, ReservationStatus } from '../../types'

const statusMap: Record<ReservationStatus, { color: string; text: string }> = {
  confirmed: { color: 'primary', text: '已确认' },
  check_in: { color: 'success', text: '已入住' },
  check_out: { color: 'default', text: '已退房' },
  cancelled: { color: 'danger', text: '已取消' },
}

export default function ConfirmPage() {
  const { reservationId } = useParams<{ reservationId: string }>()
  const navigate = useNavigate()
  const [reservation, setReservation] = useState<Reservation | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    reservationsApi.getById(reservationId!).then((res) => setReservation(res.data)).finally(() => setLoading(false))
  }, [reservationId])

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><SpinLoading /></div>
  if (!reservation) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>预订信息不存在</div>

  const status = statusMap[reservation.status]
  const nights = Math.max(1, Math.round(
    (new Date(reservation.checkOutDate).getTime() - new Date(reservation.checkInDate).getTime()) / 86400000
  ))

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <NavBar onBack={() => navigate('/')}>预订详情</NavBar>

      <div style={{ background: 'linear-gradient(135deg, #52c41a, #389e0d)', padding: '24px 16px', textAlign: 'center', color: '#fff' }}>
        <div style={{ fontSize: 40, marginBottom: 8 }}>✓</div>
        <div style={{ fontSize: 18, fontWeight: 'bold' }}>预订成功！</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>请按时入住，祝您旅途愉快</div>
      </div>

      <div style={{ background: '#fff', margin: '12px 16px', borderRadius: 12, padding: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <span style={{ fontWeight: 'bold', fontSize: 15 }}>预订信息</span>
          <Tag color={status.color as any}>{status.text}</Tag>
        </div>

        {[
          { label: '预订号', value: reservation.id },
          { label: '酒店', value: reservation.hotel?.nameZh || '—' },
          { label: '房型', value: reservation.room?.name || '—' },
          { label: '入住日期', value: reservation.checkInDate?.slice(0, 10) },
          { label: '离店日期', value: reservation.checkOutDate?.slice(0, 10) },
          { label: '入住晚数', value: `${nights} 晚` },
          { label: '联系人', value: reservation.guestName },
          { label: '联系电话', value: reservation.guestPhone },
          { label: '联系邮箱', value: reservation.guestEmail },
        ].map(({ label, value }) => (
          <div key={label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #f5f5f5', fontSize: 14 }}>
            <span style={{ color: '#999' }}>{label}</span>
            <span style={{ color: '#333', maxWidth: '60%', textAlign: 'right', wordBreak: 'break-all' }}>{value}</span>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', fontSize: 15 }}>
          <span style={{ fontWeight: 'bold' }}>总价</span>
          <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 18 }}>¥{reservation.totalPrice}</span>
        </div>
      </div>

      <div style={{ padding: '0 16px' }}>
        <Button color="primary" block onClick={() => navigate('/')}>返回首页</Button>
      </div>
    </div>
  )
}
