import { useEffect, useState } from 'react'
import { Table, Button, Modal, Form, Input, Space, App, Popconfirm } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import { tagsApi } from '../../api/tags'
import type { HotelTag } from '../../types'

export default function TagsPage() {
  const [tags, setTags] = useState<HotelTag[]>([])
  const [loading, setLoading] = useState(false)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<HotelTag | null>(null)
  const [form] = Form.useForm()
  const { message } = App.useApp()

  const load = async () => {
    setLoading(true)
    try {
      const res = await tagsApi.getAll()
      setTags(res.data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const openCreate = () => {
    setEditing(null)
    form.resetFields()
    setModalOpen(true)
  }

  const openEdit = (tag: HotelTag) => {
    setEditing(tag)
    form.setFieldsValue(tag)
    setModalOpen(true)
  }

  const handleSubmit = async () => {
    const values = await form.validateFields()
    try {
      if (editing) {
        await tagsApi.update(editing.id, values)
        message.success('更新成功')
      } else {
        await tagsApi.create(values)
        message.success('创建成功')
      }
      setModalOpen(false)
      load()
    } catch {
      message.error('操作失败')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await tagsApi.remove(id)
      message.success('删除成功')
      load()
    } catch {
      message.error('删除失败')
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>标签管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>新建标签</Button>
      </div>
      <Table
        loading={loading}
        dataSource={tags}
        rowKey="id"
        columns={[
          { title: '标签名称', dataIndex: 'name' },
          { title: '描述', dataIndex: 'description', render: (v) => v || '—' },
          {
            title: '操作', key: 'action', width: 160,
            render: (_, r) => (
              <Space>
                <Button size="small" onClick={() => openEdit(r)}>编辑</Button>
                <Popconfirm title="确认删除？" onConfirm={() => handleDelete(r.id)}>
                  <Button size="small" danger>删除</Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
      />
      <Modal
        title={editing ? '编辑标签' : '新建标签'}
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => setModalOpen(false)}
        okText="保存"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="标签名称" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="描述">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
