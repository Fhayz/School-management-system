import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { apiClient } from "../api";
import AdminTable from "./AdminTable";

function SchoolTable() {
  const [schools, setSchools] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);

  useEffect(() => { fetchSchools(); }, []);

  const fetchSchools = () => {
    setLoading(true);
    apiClient.get("http://localhost:8001/api/v1/super-admin/schools/")
      .then(res => setSchools(res.data))
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
    apiClient.delete(`http://localhost:8001/api/v1/super-admin/schools/${id}`)
      .then(() => {
        message.success("School deleted");
        fetchSchools();
      })
      .catch(err => {
        message.error(err.response?.data?.detail || err.message || "Delete failed");
      });
  };

  const onFinish = (values) => {
    const api = editing
      ? apiClient.put(`http://localhost:8001/api/v1/super-admin/schools/${editing.id}`, values)
      : apiClient.post("http://localhost:8001/api/v1/super-admin/schools/", values);

    api.then(() => {
      message.success(editing ? "School updated" : "School added");
      setModal(false);
      fetchSchools();
    })
    .catch(err => {
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
    { title: "School Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Address", dataIndex: "address", key: "address" },
    {
      title: "Actions",
      key: "actions",
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => onEdit(record)}>Edit</Button>
          <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record.id)}>
            <Button danger type="link">Delete</Button>
          </Popconfirm>
          <Button type="primary" onClick={() => setSelectedSchoolId(record.id)}>Manage Admins</Button>
        </Space>
      ),
    }
  ];

  return (
    <div>
      <Button type="primary" onClick={onAdd} style={{ marginBottom: 16 }}>Add School</Button>
      <Table columns={columns} dataSource={schools} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} />
      <Modal
        title={editing ? "Edit School" : "Add School"}
        open={modal}
        onCancel={() => setModal(false)}
        onOk={() => form.submit()}
        okText={editing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="School Name" rules={[{ required: true, message: "Enter the school name" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="email" label="Email" rules={[{ required: true, type: "email", message: "Enter a valid email" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="phone" label="Phone" rules={[{ required: true, message: "Enter a phone number" }]}>
            <Input />
          </Form.Item>
          <Form.Item name="address" label="Address" rules={[{ required: true, message: "Enter the address" }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      {/* Admins modal */}
      {selectedSchoolId && (
        <Modal
          open={!!selectedSchoolId}
          onCancel={() => setSelectedSchoolId(null)}
          title="Manage School Admins"
          footer={null}
          width={700}
        >
          <AdminTable schoolId={selectedSchoolId} />
        </Modal>
      )}
    </div>
  );
}

export default SchoolTable;
