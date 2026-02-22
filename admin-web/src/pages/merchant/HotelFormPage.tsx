import { useEffect, useState } from 'react'
import { Form, Input, InputNumber, DatePicker, Button, Space, App, Divider, Upload } from 'antd'
import { PlusOutlined, MinusCircleOutlined, InboxOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import { hotelsApi } from '../../api/hotels'
import { useAuthStore } from '../../store/auth'
import dayjs from 'dayjs'
import type { UploadFile } from 'antd'

export default function HotelFormPage() {
  const { id } = useParams()
  const isEdit = !!id
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const token = useAuthStore(s => s.token)

  useEffect(() => {
    if (!isEdit) return
    hotelsApi.getById(id).then((res) => {
      const h = res.data
      form.setFieldsValue({
        ...h,
        openingDate: h.openingDate ? dayjs(h.openingDate) : null,
        rooms: h.rooms || [],
        facilities: h.facilities || [],
      })
      if (h.images?.length) {
        setFileList(h.images.map((img: any, i: number) => ({
          uid: String(i),
          name: `image-${i}`,
          status: 'done',
          url: img.url,
        })))
      }
    })
  }, [id])

  const onFinish = async (values: any) => {
    setLoading(true)
    try {
      const images = fileList
        .filter(f => f.status === 'done')
        .map(f => ({ url: f.url || f.response?.url, description: '' }))
      const payload = {
        ...values,
        openingDate: values.openingDate?.toISOString(),
        images,
      }
      if (isEdit) {
        await hotelsApi.update(id!, payload)
        message.success('更新成功')
      } else {
        await hotelsApi.create(payload)
        message.success('创建成功，等待审核')
      }
      navigate('/merchant/hotels')
    } catch (e: any) {
      message.error(e.response?.data?.message || '操作失败')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 800 }}>
      <h2>{isEdit ? '编辑酒店' : '添加酒店'}</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Divider>基本信息</Divider>
        <Form.Item name="nameZh" label="酒店中文名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="nameEn" label="酒店英文名" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="address" label="地址" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="starRating" label="星级" rules={[{ required: true }]}>
          <InputNumber min={1} max={5} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="openingDate" label="开业时间" rules={[{ required: true }]}>
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item name="description" label="酒店描述">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Divider>酒店图片</Divider>
        <Form.Item label="拖拽或点击上传图片">
          <Upload.Dragger
            name="file"
            action="/upload"
            headers={token ? { Authorization: `Bearer ${token}` } : {}}
            listType="picture"
            fileList={fileList}
            onChange={({ fileList: newList }) => setFileList(newList)}
            accept="image/*"
            multiple
          >
            <p className="ant-upload-drag-icon"><InboxOutlined /></p>
            <p className="ant-upload-text">点击或拖拽图片到此区域上传</p>
            <p className="ant-upload-hint">支持 JPG、PNG、GIF 等格式</p>
          </Upload.Dragger>
        </Form.Item>

        <Divider>房型信息</Divider>
        <Form.List name="rooms">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }} wrap>
                  <Form.Item {...rest} name={[name, 'name']} rules={[{ required: true, message: '请输入房型名' }]}>
                    <Input placeholder="房型名称" />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'price']} rules={[{ required: true }]}>
                    <InputNumber placeholder="价格" min={0} prefix="¥" />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'capacity']} rules={[{ required: true }]}>
                    <InputNumber placeholder="容纳人数" min={1} />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'quantity']} rules={[{ required: true }]}>
                    <InputNumber placeholder="房间数量" min={1} />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'description']}>
                    <Input placeholder="描述（可选）" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>添加房型</Button>
            </>
          )}
        </Form.List>

        <Divider>设施信息</Divider>
        <Form.List name="facilities">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...rest }) => (
                <Space key={key} align="baseline" style={{ display: 'flex', marginBottom: 8 }}>
                  <Form.Item {...rest} name={[name, 'name']} rules={[{ required: true, message: '请输入设施名' }]}>
                    <Input placeholder="设施名称" />
                  </Form.Item>
                  <Form.Item {...rest} name={[name, 'category']}>
                    <Input placeholder="分类（可选）" />
                  </Form.Item>
                  <MinusCircleOutlined onClick={() => remove(name)} style={{ color: 'red' }} />
                </Space>
              ))}
              <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>添加设施</Button>
            </>
          )}
        </Form.List>

        <Divider />
        <Space>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? '保存修改' : '提交审核'}
          </Button>
          <Button onClick={() => navigate('/merchant/hotels')}>取消</Button>
        </Space>
      </Form>
    </div>
  )
}
