import { useEffect, useState } from 'react';
import Link from 'next/link';
import Layout from '../../../components/Layout';
import RequireAuth from '../../../components/RequireAuth';
import { getMyHotels, deleteHotel } from '../../../lib/api';
import { Hotel } from '../../../types';
import { Table, Button, Tag, Space, Typography, message, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table'; // 导入 Table 列类型
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';

const { Title } = Typography;

export default function MerchantHotels() {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadHotels();
  }, []);

  const loadHotels = async () => {
    setLoading(true);
    try {
      const data = await getMyHotels();
      setHotels(data);
    } catch (error) {
      message.error('加载酒店列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteHotel(id);
      setHotels(hotels.filter(h => h.id !== id));
      message.success('删除成功');
    } catch (error: any) {
      message.error(error.response?.data?.message || '删除失败');
    }
  };

  // 状态标签配置
  const getStatusTag = (status: string) => {
    switch (status) {
      case 'approved':
        return <Tag color="success">已通过</Tag>;
      case 'pending':
        return <Tag color="warning">待审核</Tag>;
      case 'rejected':
        return <Tag color="error">已拒绝</Tag>;
      case 'offline':
        return <Tag color="default">已下线</Tag>;
      default:
        return <Tag>{status}</Tag>;
    }
  };

  // 核心修复：使用单独导入的 ColumnsType 类型
  const columns: ColumnsType<Hotel> = [
    {
      title: '酒店名称',
      dataIndex: 'nameZh',
      key: 'nameZh',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '星级',
      dataIndex: 'starRating',
      key: 'starRating',
    },
    {
      title: '状态',
      key: 'status',
      // 明确参数类型
      render: (_: React.ReactNode, record: Hotel) => getStatusTag(record.status),
    },
    {
      title: '操作',
      key: 'action',
      // 明确参数类型
      render: (_: React.ReactNode, record: Hotel) => (
        <Space size="middle">
          <Link href={`/merchant/hotels/${record.id}/edit`}>
            <Button type="text" icon={<EditOutlined />}>编辑</Button>
          </Link>
          <Popconfirm
            title="确定删除该酒店吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>删除</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <RequireAuth allowedRoles={['merchant']}>
      <Layout>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Title level={3}>我的酒店</Title>
            <Link href="/merchant/hotels/new">
              <Button type="primary" icon={<PlusOutlined />}>新增酒店</Button>
            </Link>
          </div>

          <Table
            columns={columns}
            dataSource={hotels}
            rowKey="id"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
        </Space>
      </Layout>
    </RequireAuth>
  );
}