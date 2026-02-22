import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Typography, Modal } from 'antd';
import { PoweroffOutlined, PlayCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Layout from '../../../components/Layout';
import RequireAuth from '../../../components/RequireAuth';
import { getAllHotels, offlineHotel, onlineHotel } from '../../../lib/api';
import { Hotel } from '../../../types';
import HotelDetailModal from '../../../components/HotelDetailModal';


const { Title } = Typography;

export default function AdminHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  const showDetail = (hotel: Hotel) => {
    setSelectedHotelId(hotel.id);
    setDetailModalOpen(true);
  };

  const loadHotels = async () => {
    setLoading(true);
    try {
      const data = await getAllHotels({ page, limit });
      setHotels(data.hotels || []);
      setTotal(data.total || 0);
    } catch (error: any) {
      message.error(error.response?.data?.message || '加载酒店列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHotels();
  }, [page]);

  const handleOffline = async (id: string) => {
    try {
      await offlineHotel(id);
      message.success('酒店已下线');
      loadHotels();
    } catch (error: any) {
      message.error(error.response?.data?.message || '下线操作失败');
    }
  };

  const handleOnline = async (id: string) => {
    try {
      await onlineHotel(id);
      message.success('酒店已上线');
      loadHotels();
    } catch (error: any) {
      message.error(error.response?.data?.message || '上线操作失败');
    }
  };

  // 渲染状态标签
  const renderStatus = (status: string) => {
    let color = 'default';
    let text = status;
    switch (status) {
      case 'approved':
        color = 'success';
        text = '已通过';
        break;
      case 'pending':
        color = 'warning';
        text = '待审核';
        break;
      case 'rejected':
        color = 'error';
        text = '已拒绝';
        break;
      case 'offline':
        color = 'default';
        text = '已下线';
        break;
      default:
        text = status;
    }
    return <Tag color={color}>{text}</Tag>;
  };

  const columns: ColumnsType<Hotel> = [
    {
      title: '酒店名称',
      dataIndex: 'nameZh',
      key: 'nameZh',
      sorter: (a, b) => a.nameZh.localeCompare(b.nameZh),
    },
    {
      title: '商户',
      key: 'merchant',
      render: (_, record) => record.merchant?.name || record.merchantId,
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
      ellipsis: true,
    },
    {
      title: '星级',
      dataIndex: 'starRating',
      key: 'starRating',
      sorter: (a, b) => a.starRating - b.starRating,
    },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status) => renderStatus(status),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            size="small"
          >
            详情
          </Button>
          {record.status === 'approved' && (
            <Popconfirm
              title="确定下线该酒店吗？下线后酒店将不再对外展示。"
              onConfirm={() => handleOffline(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" danger icon={<PoweroffOutlined />} size="small">
                下线
              </Button>
            </Popconfirm>
          )}
          {record.status === 'offline' && (
            <Popconfirm
              title="确定上线该酒店吗？上线后酒店将重新对外展示。"
              onConfirm={() => handleOnline(record.id)}
              okText="确定"
              cancelText="取消"
            >
              <Button type="link" icon={<PlayCircleOutlined />} size="small">
                上线
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  const handleTableChange = (pagination: any) => {
    setPage(pagination.current);
  };

  return (
    <RequireAuth allowedRoles={['admin']}>
      <Layout>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={3}>所有酒店</Title>
          <Table
            columns={columns}
            dataSource={hotels}
            rowKey="id"
            loading={loading}
            pagination={{
              current: page,
              pageSize: limit,
              total: total,
              showSizeChanger: false,
              showQuickJumper: true,
            }}
            onChange={handleTableChange}
          />
        </Space>

        {/* 详情弹窗，用于调试查看状态值 */}
        <HotelDetailModal
          hotelId={selectedHotelId}
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />
      </Layout>
    </RequireAuth>
  );
}