// pages/admin/audits/index.tsx
import { useEffect, useState } from 'react';
import { Table, Button, Space, Tag, message, Popconfirm, Typography, Modal, Input } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Layout from '../../../components/Layout';
import RequireAuth from '../../../components/RequireAuth';
import { getPendingHotels, approveHotel, rejectHotel } from '../../../lib/api';
import { Hotel } from '../../../types';
import HotelDetailModal from '../../../components/HotelDetailModal';

const { Title } = Typography;
const { TextArea } = Input;

export default function AdminAudits() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [loading, setLoading] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentHotel, setCurrentHotel] = useState<Hotel | null>(null);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedHotelId, setSelectedHotelId] = useState<string | null>(null);

  const showDetail = (hotel: Hotel) => {
    setSelectedHotelId(hotel.id);
    setDetailModalOpen(true);
  };

  const loadPending = async () => {
    setLoading(true);
    try {
      const data = await getPendingHotels();
      setHotels(data || []);
      setTotal(data?.length || 0); // 手动设置总数为数组长度
    } catch (error) {
      message.error('加载待审核酒店失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPending();
  }, [page]);

  const handleApprove = async (id: string) => {
    try {
      await approveHotel(id);
      message.success('审核通过');
      loadPending();
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败');
    }
  };

  const handleReject = (id: string) => {
    setRejectingId(id);
    setRejectReason('');
    setRejectModalVisible(true);
  };

  const confirmReject = async () => {
    if (!rejectReason.trim()) {
      message.warning('请输入拒绝原因');
      return;
    }
    try {
      await rejectHotel(rejectingId!, rejectReason);
      message.success('已拒绝');
      setRejectModalVisible(false);
      loadPending();
    } catch (error: any) {
      message.error(error.response?.data?.message || '操作失败');
    }
  };


  // 状态标签渲染（待审核页面只显示 pending，但保留其他状态以防万一）
  const renderStatus = (status: string) => {
    switch (status) {
      case 'pending':
        return <Tag color="warning">待审核</Tag>;
      case 'approved':
        return <Tag color="success">已通过</Tag>;
      case 'rejected':
        return <Tag color="error">已拒绝</Tag>;
      case 'offline':
        return <Tag color="default">已下线</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
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
      dataIndex: 'status',
      key: 'status',
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
          {record.status === 'pending' && (
            <>
              <Button
                type="link"
                icon={<CheckCircleOutlined />}
                onClick={() => handleApprove(record.id)}
                size="small"
                style={{ color: '#52c41a' }}
              >
                通过
              </Button>
              <Button
                type="link"
                danger
                icon={<CloseCircleOutlined />}
                onClick={() => handleReject(record.id)}
                size="small"
              >
                拒绝
              </Button>
            </>
          )}
          {/* 可根据需要添加其他状态的操作，如重新审核等 */}
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
          <Title level={3}>待审核酒店</Title>
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

        <HotelDetailModal
          hotelId={selectedHotelId}
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
        />

        {/* 拒绝原因输入弹窗 */}
        <Modal
          title="填写拒绝原因"
          open={rejectModalVisible}
          onOk={confirmReject}
          onCancel={() => setRejectModalVisible(false)}
          okText="提交"
          cancelText="取消"
        >
          <TextArea
            rows={4}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            placeholder="请输入拒绝原因..."
          />
        </Modal>
      </Layout>
    </RequireAuth>
  );
}