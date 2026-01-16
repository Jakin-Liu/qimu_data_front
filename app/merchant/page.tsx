'use client';

import { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Card,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Tag,
  Typography,
  Row,
  Col,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ReloadOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import {
  getMerchantList,
  createMerchant,
  updateMerchant,
  deactivateMerchant,
} from '@/lib/api/merchant';
import type {
  Merchant,
  CreateMerchantDto,
  UpdateMerchantDto,
  MerchantStatus,
} from '@/lib/types/merchant';
import DashboardLayout from '@/components/DashboardLayout';

const { Title } = Typography;
const { TextArea } = Input;
const { Option } = Select;

export default function MerchantPage() {
  const [merchants, setMerchants] = useState<Merchant[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingMerchant, setEditingMerchant] = useState<Merchant | null>(null);
  const [form] = Form.useForm();
  const [statusFilter, setStatusFilter] = useState<MerchantStatus | undefined>();

  // 加载商户列表
  const loadMerchants = async () => {
    setLoading(true);
    try {
      const params = statusFilter ? { status: statusFilter } : undefined;
      const data = await getMerchantList(params);
      setMerchants(data);
    } catch (error: any) {
      message.error(error.message || '加载商户列表失败');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMerchants();
  }, [statusFilter]);

  // 打开新增模态框
  const handleAdd = () => {
    setEditingMerchant(null);
    form.resetFields();
    setModalVisible(true);
  };

  // 打开编辑模态框
  const handleEdit = (record: Merchant) => {
    setEditingMerchant(record);
    form.setFieldsValue({
      name: record.name,
      description: record.description,
      status: record.status,
    });
    setModalVisible(true);
  };

  // 提交表单
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingMerchant) {
        // 更新商户
        const updateData: UpdateMerchantDto = {
          name: values.name,
          description: values.description,
          status: values.status,
        };
        await updateMerchant(editingMerchant.id, updateData);
        message.success('商户更新成功');
      } else {
        // 创建商户
        const createData: CreateMerchantDto = {
          name: values.name,
          description: values.description,
          adminEmail: values.adminEmail,
          adminPassword: values.adminPassword,
          adminName: values.adminName,
        };
        await createMerchant(createData);
        message.success('商户创建成功');
      }
      
      setModalVisible(false);
      form.resetFields();
      loadMerchants();
    } catch (error: any) {
      if (error.errorFields) {
        // 表单验证错误
        return;
      }
      message.error(error.message || '操作失败');
    }
  };

  // 删除商户
  const handleDelete = async (id: number) => {
    try {
      await deactivateMerchant(id);
      message.success('商户已停用');
      loadMerchants();
    } catch (error: any) {
      message.error(error.message || '停用商户失败');
    }
  };

  // 表格列定义
  const columns: ColumnsType<Merchant> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: '商户名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text: string) => text || '-',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      filters: [
        { text: '启用', value: 'ACTIVE' },
        { text: '停用', value: 'INACTIVE' },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status: MerchantStatus) => (
        <Tag color={status === 'ACTIVE' ? 'green' : 'red'}>
          {status === 'ACTIVE' ? '启用' : '停用'}
        </Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '更新时间',
      dataIndex: 'updatedAt',
      key: 'updatedAt',
      width: 180,
      render: (text: string) => new Date(text).toLocaleString('zh-CN'),
    },
    {
      title: '操作',
      key: 'action',
      width: 180,
      fixed: 'right',
      render: (_: any, record: Merchant) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要停用该商户吗？"
            description="停用后该商户将无法使用系统"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              停用
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <DashboardLayout>
      <Card>
        {/* 页面标题和操作栏 */}
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Space align="center">
              <ShopOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
              <Title level={2} style={{ margin: 0 }}>
                商户管理
              </Title>
            </Space>
          </Col>
          <Col>
            <Space>
              <Select
                placeholder="筛选状态"
                allowClear
                style={{ width: 120 }}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value)}
              >
                <Option value="ACTIVE">启用</Option>
                <Option value="INACTIVE">停用</Option>
              </Select>
              <Button
                icon={<ReloadOutlined />}
                onClick={loadMerchants}
                loading={loading}
              >
                刷新
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                size="large"
              >
                新增商户
              </Button>
            </Space>
          </Col>
        </Row>

        {/* 商户列表表格 */}
        <Table
          columns={columns}
          dataSource={merchants}
          rowKey="id"
          loading={loading}
          pagination={{
            showSizeChanger: true,
            showTotal: (total) => `共 ${total} 条记录`,
            pageSizeOptions: ['10', '20', '50', '100'],
            defaultPageSize: 10,
          }}
          scroll={{ x: 1200 }}
        />
      </Card>

      {/* 新增/编辑模态框 */}
      <Modal
        title={editingMerchant ? '编辑商户' : '新增商户'}
        open={modalVisible}
        onOk={handleSubmit}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        width={600}
        okText="确定"
        cancelText="取消"
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          autoComplete="off"
        >
          <Form.Item
            label="商户名称"
            name="name"
            rules={[
              { required: true, message: '请输入商户名称' },
              { max: 100, message: '商户名称不能超过100个字符' },
            ]}
          >
            <Input placeholder="请输入商户名称" />
          </Form.Item>

          <Form.Item
            label="商户描述"
            name="description"
            rules={[{ max: 500, message: '描述不能超过500个字符' }]}
          >
            <TextArea
              rows={4}
              placeholder="请输入商户描述（可选）"
              showCount
              maxLength={500}
            />
          </Form.Item>

          {editingMerchant ? (
            <Form.Item
              label="状态"
              name="status"
              rules={[{ required: true, message: '请选择状态' }]}
            >
              <Select placeholder="请选择状态">
                <Option value="ACTIVE">启用</Option>
                <Option value="INACTIVE">停用</Option>
              </Select>
            </Form.Item>
          ) : (
            <>
              <Form.Item
                label="管理员姓名"
                name="adminName"
                rules={[
                  { required: true, message: '请输入管理员姓名' },
                  { max: 50, message: '姓名不能超过50个字符' },
                ]}
              >
                <Input placeholder="请输入管理员姓名" />
              </Form.Item>

              <Form.Item
                label="管理员邮箱"
                name="adminEmail"
                rules={[
                  { required: true, message: '请输入管理员邮箱' },
                  { type: 'email', message: '请输入有效的邮箱地址' },
                ]}
              >
                <Input placeholder="请输入管理员邮箱" />
              </Form.Item>

              <Form.Item
                label="管理员密码"
                name="adminPassword"
                rules={[
                  { required: true, message: '请输入管理员密码' },
                  { min: 6, message: '密码至少6个字符' },
                ]}
              >
                <Input.Password placeholder="请输入管理员密码" />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </DashboardLayout>
  );
}

