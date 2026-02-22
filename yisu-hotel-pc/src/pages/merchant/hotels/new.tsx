import { useRouter } from 'next/router';
import { useState } from 'react';
import Layout from '../../../components/Layout';
import RequireAuth from '../../../components/RequireAuth';
import HotelForm from '../../../components/HotelForm';
import { createHotel, uploadHotelImage } from '../../../lib/api';
import { CreateHotelDto } from '../../../types';
import { message } from 'antd';

export default function NewHotel() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // 提交函数（返回 Promise，适配 AntD Form）
  const onSubmit = async (
    data: CreateHotelDto,
    fileList: any[],
    imageDescriptions: { [key: string]: string },
    mainImageIndex: number
  ) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        openingDate: (data.openingDate as any).toISOString(),
        rooms: data.rooms?.map(r => ({
          ...r,
          price: Number(r.price),
          capacity: Number(r.capacity),
          quantity: Number(r.quantity),
        })),
        promotions: data.promotions?.map(p => ({
          ...p,
          discountValue: Number(p.discountValue),
          startDate: (p.startDate as any).toISOString(),
          endDate: (p.endDate as any).toISOString(),
        })),
        // 新字段直接传递（已为正确格式）
        nearbyAttractions: data.nearbyAttractions,
        facilities: data.facilities,
        tagIds: data.tagIds,
      };
      // 转换 Date 为 ISO 字符串，供后端接收
      const hotel = await createHotel(data);
      // 2. 上传图片
      const uploadPromises = fileList.map((file, index) => {
        const formData = new FormData();
        formData.append('file', file.originFileObj);
        formData.append('description', imageDescriptions[file.uid] || '');
        formData.append('isMain', String(mainImageIndex === index));
        return uploadHotelImage(hotel.id, formData);
      });
      await Promise.all(uploadPromises);
      message.success('酒店创建成功');
      router.push('/merchant/hotels');
    } catch (error: any) {
      message.error(error.response?.data?.message || '创建失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <RequireAuth allowedRoles={['merchant']}>
      <Layout>
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-bold mb-4">新增酒店</h2>
          {/* 直接传递 onSubmit，无需额外处理 */}
          <HotelForm onSubmit={onSubmit} loading={loading} />
        </div>
      </Layout>
    </RequireAuth>
  );
}