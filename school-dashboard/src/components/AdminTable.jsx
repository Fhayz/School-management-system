import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { apiClient } from "../api"; // Your configured axios instance

function AdminTable({ schoolId }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAdmins();
  }, [schoolId]);

  const fetchAdmins = () => {
    setLoading(true);
    apiClient.get(`/super-admin/schools/${schoolId}/admins`)
      .then(res => setAdmins(res.data))
      .finally(() => setLoading(false));
  };

  const onAdd = () => {
    setEditing(null);
    form.resetFields();
    setModal(true);
  };

  const onEdit = (record) => {
    setEditing(record);
    form.setFieldsValue(record);
    setModal(true);
  };

  const onDelete = (id) => {
    apiClient.delete(`/super-admin/schools/${schoolId}/admins/${id}`)
      .then(() => {
        message.success("Admin deleted");
        fetchAdmins();
      }).catch(err => {
        message.error(err.response?.data?.detail || "Delete failed");
      });
  };

  const onFinish = (values) => {
    let api;
    if (editing) {
      api = apiClient.put(`/super-admin/schools/${schoolId}/admins/${editing.id}`, values);
    } else {
      api = apiClient.post(`/super-admin/schools/${schoolId}/admins`, values);
    }
    api.then(() => {
      message.success(editing ? "Admin updated" : "Admin added");
      setModal(false);
      fetchAdmins();
    }).catch(err => {
      message.error(
        err.response?.data?.detail
          ? typeof err.response.data.detail === "string"
            ? err.response.data.detail
            : JSON.stringify(err.response.data.detail)
          : err.message
      );
    });
  };

  const columns = [
    { title: "First Name", dataIndex: "first_name", key: "first_name" },
    { title: "Last Name", dataIndex: "last_name", key: "last_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Role", dataIndex: "role", key: "role" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm title="Sure to delete admin?" onConfirm={() => onDelete(record.id)}>
            <Button danger type="link">Delete</Button>
          </Popconfirm>
        </Space>
      ),
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={onAdd} style={{ marginBottom: 16 }}>Add Admin</Button>
      <Table columns={columns} dataSource={admins} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal
        title={editing ? "Edit Admin" : "Add Admin"}
        open={modal}
        onCancel={() => setModal(false)}
        onOk={() => form.submit()}
        okText={editing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="first_name" label="First Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="password" label="Password"
            rules={editing ? [] : [{ required: true, min: 6, message: "Minimum 6 characters" }]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default AdminTable;
