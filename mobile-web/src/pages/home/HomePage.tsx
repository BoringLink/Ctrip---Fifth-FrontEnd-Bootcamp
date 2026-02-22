import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { SearchBar, Tag } from 'antd-mobile'
import { hotelsApi } from '../../api/hotels'
import type { Hotel, HotelTag } from '../../types'

export default function HomePage() {
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState('')
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [tags, setTags] = useState<HotelTag[]>([])

  useEffect(() => {
    hotelsApi.search({ limit: 6 }).then((res) => setHotels(res.data))
    hotelsApi.getTags().then((res) => setTags(res.data))
  }, [])

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <div style={{ background: 'linear-gradient(135deg, #1677ff, #0958d9)', padding: '20px 16px 32px' }}>
        <div style={{ color: '#fff', fontSize: 22, fontWeight: 'bold', marginBottom: 16 }}>易宿酒店</div>
        <SearchBar
          placeholder="搜索目的地、酒店名称"
          value={keyword}
          onChange={setKeyword}
          onSearch={() => navigate(`/search?keyword=${encodeURIComponent(keyword)}`)}
          style={{ '--border-radius': '20px' }}
        />
      </div>

      <div style={{ background: '#fff', padding: '12px 16px', display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: -12, borderRadius: '12px 12px 0 0' }}>
        {tags.slice(0, 8).map((t) => (
          <Tag
            key={t.id}
            color="primary"
            fill="outline"
            style={{ cursor: 'pointer', padding: '4px 12px', fontSize: 13 }}
            onClick={() => navigate(`/search?tag=${encodeURIComponent(t.name)}`)}
          >
            {t.name}
          </Tag>
        ))}
      </div>

      <div style={{ padding: '16px' }}>
        <div style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 12 }}>推荐酒店</div>
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => navigate(`/hotel/${hotel.id}`)}
            style={{ background: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer' }}
          >
            <div style={{ height: 160, background: '#e8e8e8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999' }}>
              {hotel.images?.[0]
                ? <img src={hotel.images[0].url} alt={hotel.nameZh} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span>暂无图片</span>}
            </div>
            <div style={{ padding: '12px' }}>
              <div style={{ fontWeight: 'bold', fontSize: 15, marginBottom: 4 }}>{hotel.nameZh}</div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 8 }}>{hotel.address}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#faad14', fontSize: 12 }}>{'★'.repeat(hotel.starRating)}</span>
                <span style={{ color: '#ff4d4f', fontWeight: 'bold' }}>¥{hotel.rooms?.[0]?.price ?? '—'} 起</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
