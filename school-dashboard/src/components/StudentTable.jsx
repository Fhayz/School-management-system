import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { apiClient } from "../api";

const columns = [
  { title: "First Name", dataIndex: "first_name", key: "first_name" },
  { title: "Last Name", dataIndex: "last_name", key: "last_name" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "Gender", dataIndex: "gender", key: "gender" },
  { title: "Date of Birth", dataIndex: "date_of_birth", key: "date_of_birth" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "Guardian Name", dataIndex: "guardian_name", key: "guardian_name" },
  { title: "Guardian Phone", dataIndex: "guardian_phone", key: "guardian_phone" }
];

function StudentTable() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    apiClient.get("http://localhost:8001/api/v1/students/")
      .then(res => setStudents(res.data))
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
    apiClient.delete(`http://localhost:8001/api/v1/students/${id}`)
      .then(() => {
        message.success("Student deleted");
        fetchStudents();
      });
  };

  const onFinish = (values) => {
    const api = editing
      ? apiClient.put(`http://localhost:8001/api/v1/students/${editing.id}`, values)
      : apiClient.post("http://localhost:8001/api/v1/students/", values);
    api.then(() => {
      message.success(editing ? "Student updated" : "Student added");
      setModal(false);
      fetchStudents();
    });
  };

  const actionCol = {
    title: "Actions",
    key: "actions",
    render: (text, record) => (
      <Space>
        <Button type="link" onClick={() => onEdit(record)}>Edit</Button>
        <Popconfirm title="Sure to delete?" onConfirm={() => onDelete(record.id)}>
          <Button danger type="link">Delete</Button>
        </Popconfirm>
      </Space>
    ),
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={onAdd}>Add Student</Button>
      <Table
        columns={[...columns, actionCol]}
        dataSource={students}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? "Edit Student" : "Add Student"}
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
          <Form.Item name="email" label="Email">
            <Input type="email" />
          </Form.Item>
          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>
          <Form.Item name="gender" label="Gender">
            <Input />
          </Form.Item>
          <Form.Item name="date_of_birth" label="Date of Birth">
            <Input type="date" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="guardian_name" label="Guardian Name">
            <Input />
          </Form.Item>
          <Form.Item name="guardian_phone" label="Guardian Phone">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default StudentTable;
