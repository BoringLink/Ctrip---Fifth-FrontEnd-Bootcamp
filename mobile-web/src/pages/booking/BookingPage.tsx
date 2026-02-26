import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavBar, SpinLoading, Button, Input, Toast, DatePicker } from 'antd-mobile'
import { hotelsApi } from '../../api/hotels'
import { reservationsApi } from '../../api/reservations'
import type { Hotel, HotelRoom } from '../../types'

export default function BookingPage() {
  const { hotelId, roomId } = useParams<{ hotelId: string; roomId: string }>()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [room, setRoom] = useState<HotelRoom | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  const [guestName, setGuestName] = useState('')
  const [guestPhone, setGuestPhone] = useState('')
  const [guestEmail, setGuestEmail] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [showCheckIn, setShowCheckIn] = useState(false)
  const [showCheckOut, setShowCheckOut] = useState(false)

  useEffect(() => {
    hotelsApi.getById(hotelId!).then((res) => {
      setHotel(res.data)
      setRoom(res.data.rooms?.find((r) => r.id === roomId) || null)
    }).finally(() => setLoading(false))
  }, [hotelId, roomId])

  const nights = (() => {
    if (!checkIn || !checkOut) return 0
    return Math.max(1, Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
  })()

  const totalPrice = room ? room.price * nights : 0

  const handleSubmit = async () => {
    if (!guestName || !guestPhone || !guestEmail || !checkIn || !checkOut) {
      Toast.show({ content: '请填写完整信息', icon: 'fail' })
      return
    }
    setSubmitting(true)
    try {
      const res = await reservationsApi.create({
        hotelId: hotelId!,
        roomId: roomId!,
        checkInDate: new Date(checkIn).toISOString(),
        checkOutDate: new Date(checkOut).toISOString(),
        guestName,
        guestPhone,
        guestEmail,
        totalPrice,
      })
      navigate(`/booking/confirm/${res.data.id}`)
    } catch (e: any) {
      Toast.show({ content: e.response?.data?.message || '预订失败，请重试', icon: 'fail' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><SpinLoading /></div>

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: 100 }}>
      <NavBar onBack={() => navigate(-1)}>填写预订信息</NavBar>

      <div style={{ background: '#fff', padding: '16px', marginBottom: 8 }}>
        <div style={{ fontWeight: 'bold', fontSize: 15 }}>{hotel?.nameZh}</div>
        <div style={{ color: '#666', fontSize: 13, marginTop: 4 }}>{room?.name} · ¥{room?.price}/晚</div>
      </div>

      <div style={{ background: '#fff', marginBottom: 8 }}>
        <div style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>入住日期</div>
        <div
          style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setShowCheckIn(true)}
        >
          <span style={{ color: '#666' }}>入住日期</span>
          <span style={{ color: checkIn ? '#333' : '#bbb' }}>{checkIn || '请选择'}</span>
        </div>
        <div
          style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', borderTop: '1px solid #f0f0f0' }}
          onClick={() => setShowCheckOut(true)}
        >
          <span style={{ color: '#666' }}>离店日期</span>
          <span style={{ color: checkOut ? '#333' : '#bbb' }}>{checkOut || '请选择'}</span>
        </div>
        {nights > 0 && (
          <div style={{ padding: '8px 16px', color: '#666', fontSize: 13 }}>
            共 {nights} 晚，合计 <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{totalPrice}</span>
          </div>
        )}
      </div>

      <div style={{ background: '#fff', marginBottom: 8 }}>
        <div style={{ padding: '12px 16px', fontWeight: 'bold', borderBottom: '1px solid #f0f0f0' }}>联系人信息</div>
        {[
          { label: '姓名', value: guestName, onChange: setGuestName, placeholder: '请输入姓名', type: 'text' },
          { label: '手机号', value: guestPhone, onChange: setGuestPhone, placeholder: '请输入手机号', type: 'tel' },
          { label: '邮箱', value: guestEmail, onChange: setGuestEmail, placeholder: '请输入邮箱', type: 'email' },
        ].map(({ label, value, onChange, placeholder, type }) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #f0f0f0' }}>
            <span style={{ width: 60, color: '#666', fontSize: 14, flexShrink: 0 }}>{label}</span>
            <Input
              value={value}
              onChange={onChange}
              placeholder={placeholder}
              type={type as any}
              style={{ flex: 1, fontSize: 14 }}
            />
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', padding: '12px 16px', boxShadow: '0 -2px 8px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ color: '#999', fontSize: 13 }}>合计：</span>
            <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 20 }}>¥{totalPrice}</span>
          </div>
          <Button color="primary" loading={submitting} onClick={handleSubmit} style={{ width: 120 }}>
            确认预订
          </Button>
        </div>
      </div>

      <DatePicker
        title="选择入住日期"
        visible={showCheckIn}
        min={new Date()}
        onConfirm={(val) => { setCheckIn(val.toISOString().slice(0, 10)); setShowCheckIn(false) }}
        onCancel={() => setShowCheckIn(false)}
        onClose={() => setShowCheckIn(false)}
      />
      <DatePicker
        title="选择离店日期"
        visible={showCheckOut}
        min={checkIn ? new Date(checkIn) : new Date()}
        onConfirm={(val) => { setCheckOut(val.toISOString().slice(0, 10)); setShowCheckOut(false) }}
        onCancel={() => setShowCheckOut(false)}
        onClose={() => setShowCheckOut(false)}
      />
    </div>
  )
}
