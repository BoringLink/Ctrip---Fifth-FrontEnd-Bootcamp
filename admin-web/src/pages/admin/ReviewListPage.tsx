import { useEffect, useState } from 'react'
import { Table, Button } from 'antd'
import { useNavigate } from 'react-router-dom'
import { hotelsApi } from '../../api/hotels'
import type { Hotel } from '../../types'

export default function ReviewListPage() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setLoading(true)
    hotelsApi.getPending()
      .then((res) => setHotels(res.data))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <h2>待审核酒店</h2>
      <Table
        loading={loading}
        dataSource={hotels}
        rowKey="id"
        columns={[
          { title: '酒店名称', dataIndex: 'nameZh' },
          { title: '地址', dataIndex: 'address', ellipsis: true },
          { title: '星级', dataIndex: 'starRating', width: 80, render: (v) => `${v}星` },
          { title: '提交时间', dataIndex: 'createdAt', render: (v) => v?.slice(0, 10) },
          {
            title: '操作', key: 'action', width: 100,
            render: (_, r) => (
              <Button type="primary" size="small" onClick={() => navigate(`/admin/review/${r.id}`)}>
                审核
              </Button>
            ),
          },
        ]}
      />
    </div>
  )
}
