import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SearchBar, Tag, NavBar, SpinLoading } from 'antd-mobile'
import { hotelsApi } from '../../api/hotels'
import type { Hotel } from '../../types'

export default function SearchPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const [starRating, setStarRating] = useState<number | undefined>()

  const search = async (star?: number) => {
    setLoading(true)
    try {
      const params: Record<string, unknown> = {}
      if (keyword) params.keyword = keyword
      if (star) params.starRating = star
      const tag = searchParams.get('tag')
      if (tag) params.tag = tag
      const res = await hotelsApi.search(params)
      setHotels(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { search(starRating) }, [])

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <NavBar onBack={() => navigate('/')}>搜索酒店</NavBar>

      <div style={{ background: '#fff', padding: '8px 16px' }}>
        <SearchBar placeholder="搜索酒店名称、地址" value={keyword} onChange={setKeyword} onSearch={() => search(starRating)} />
      </div>

      <div style={{ background: '#fff', padding: '10px 16px', marginTop: 8, display: 'flex', gap: 8, alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: '#666' }}>星级：</span>
        {[0, 3, 4, 5].map((s) => (
          <Tag
            key={s}
            color={starRating === s || (s === 0 && !starRating) ? 'primary' : 'default'}
            style={{ cursor: 'pointer' }}
            onClick={() => { const next = s || undefined; setStarRating(next); search(next) }}
          >
            {s === 0 ? '不限' : `${s}星`}
          </Tag>
        ))}
      </div>

      <div style={{ padding: 16 }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40 }}><SpinLoading /></div>
        ) : hotels.length === 0 ? (
          <div style={{ textAlign: 'center', color: '#999', padding: 40 }}>暂无结果</div>
        ) : hotels.map((hotel) => (
          <div
            key={hotel.id}
            onClick={() => navigate(`/hotel/${hotel.id}`)}
            style={{ background: '#fff', borderRadius: 12, marginBottom: 12, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.08)', cursor: 'pointer', display: 'flex' }}
          >
            <div style={{ width: 110, height: 90, background: '#e8e8e8', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 12 }}>
              {hotel.images?.[0]
                ? <img src={hotel.images[0].url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : '暂无图片'}
            </div>
            <div style={{ padding: '10px 12px', flex: 1 }}>
              <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{hotel.nameZh}</div>
              <div style={{ color: '#999', fontSize: 12, marginBottom: 6 }}>{hotel.address}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#faad14', fontSize: 12 }}>{'★'.repeat(hotel.starRating)}</span>
                <span style={{ color: '#ff4d4f', fontWeight: 'bold', fontSize: 14 }}>¥{hotel.rooms?.[0]?.price ?? '—'}起</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
