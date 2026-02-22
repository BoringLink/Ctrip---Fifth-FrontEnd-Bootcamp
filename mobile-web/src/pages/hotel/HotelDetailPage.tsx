import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { NavBar, Tag, SpinLoading, Button } from 'antd-mobile'
import { hotelsApi } from '../../api/hotels'
import type { Hotel } from '../../types'

export default function HotelDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [hotel, setHotel] = useState<Hotel | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    hotelsApi.getById(id!).then((res) => setHotel(res.data)).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div style={{ textAlign: 'center', padding: 60 }}><SpinLoading /></div>
  if (!hotel) return <div style={{ textAlign: 'center', padding: 60, color: '#999' }}>酒店不存在</div>

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: 80 }}>
      <NavBar onBack={() => navigate(-1)}>{hotel.nameZh}</NavBar>

      <div style={{ height: 220, background: '#ddd', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
        {hotel.images?.[0]
          ? <img src={hotel.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          : '暂无图片'}
      </div>

      <div style={{ background: '#fff', padding: '16px', marginBottom: 8 }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 6 }}>{hotel.nameZh}</div>
        <div style={{ color: '#faad14', marginBottom: 6 }}>{'★'.repeat(hotel.starRating)}</div>
        <div style={{ color: '#666', fontSize: 13, marginBottom: 10 }}>{hotel.address}</div>
        {hotel.tags && hotel.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {hotel.tags.map(({ tag }) => (
              <Tag key={tag.id} color="primary" fill="outline">{tag.name}</Tag>
            ))}
          </div>
        )}
        {hotel.description && (
          <div style={{ marginTop: 12, color: '#555', fontSize: 13, lineHeight: 1.6 }}>{hotel.description}</div>
        )}
      </div>

      {hotel.facilities && hotel.facilities.length > 0 && (
        <div style={{ background: '#fff', padding: '16px', marginBottom: 8 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 10 }}>酒店设施</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {hotel.facilities.map((f) => <Tag key={f.id}>{f.name}</Tag>)}
          </div>
        </div>
      )}

      {hotel.nearbyAttractions && hotel.nearbyAttractions.length > 0 && (
        <div style={{ background: '#fff', padding: '16px', marginBottom: 8 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 10 }}>附近景点</div>
          {hotel.nearbyAttractions.map((a) => (
            <div key={a.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #f0f0f0', fontSize: 13 }}>
              <span>{a.name}</span>
              <span style={{ color: '#999' }}>{a.distance} km</span>
            </div>
          ))}
        </div>
      )}

      {hotel.promotions && hotel.promotions.length > 0 && (
        <div style={{ background: '#fff', padding: '16px', marginBottom: 8 }}>
          <div style={{ fontWeight: 'bold', marginBottom: 10 }}>优惠活动</div>
          {hotel.promotions.map((p) => (
            <div key={p.id} style={{ background: '#fff7e6', borderRadius: 8, padding: '10px 12px', marginBottom: 8 }}>
              <div style={{ fontWeight: 'bold', color: '#d46b08', fontSize: 14 }}>{p.title}</div>
              {p.description && <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>{p.description}</div>}
            </div>
          ))}
        </div>
      )}

      <div style={{ background: '#fff', padding: '16px', marginBottom: 8 }}>
        <div style={{ fontWeight: 'bold', marginBottom: 12 }}>选择房型</div>
        {(hotel.rooms || []).map((room) => (
          <div key={room.id} style={{ border: '1px solid #e8e8e8', borderRadius: 10, padding: '12px', marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{room.name}</div>
                <div style={{ color: '#999', fontSize: 12 }}>容纳 {room.capacity} 人 · 剩余 {room.quantity} 间</div>
                {room.description && <div style={{ color: '#666', fontSize: 12, marginTop: 4 }}>{room.description}</div>}
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 16 }}>¥{room.price}</div>
                <div style={{ color: '#999', fontSize: 11 }}>/ 晚</div>
              </div>
            </div>
            <Button color="primary" size="small" block style={{ marginTop: 10 }} onClick={() => navigate(`/booking/${hotel.id}/${room.id}`)}>
              立即预订
            </Button>
          </div>
        ))}
      </div>
    </div>
  )
}
