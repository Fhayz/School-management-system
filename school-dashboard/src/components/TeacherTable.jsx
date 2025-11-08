import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message, DatePicker, Select } from "antd";
import {apiClient} from "../api";

const columns = [
  { title: "First Name", dataIndex: "first_name", key: "first_name" },
  { title: "Last Name", dataIndex: "last_name", key: "last_name" },
  { title: "Email", dataIndex: "email", key: "email" },
  { title: "Phone", dataIndex: "phone", key: "phone" },
  { title: "Gender", dataIndex: "gender", key: "gender" },
  { title: "Date of Birth", dataIndex: "date_of_birth", key: "date_of_birth" },
  { title: "Address", dataIndex: "address", key: "address" },
  { title: "Qualification", dataIndex: "qualification", key: "qualification" }
];

function TeacherTable() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = () => {
    setLoading(true);
    apiClient.get("http://localhost:8001/api/v1/teachers/")
      .then(res => setTeachers(res.data))
      .finally(() => setLoading(false));
  };

  const onAdd = () => {
    setEditing(null);
    form.resetFields();
    setModal(true);
  };

  const onEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      ...record,
      date_of_birth: record.date_of_birth ? record.date_of_birth : null
    });
    setModal(true);
  };

  const onDelete = (id) => {
    apiClient.delete(`http://localhost:8001/api/v1/teachers/${id}`)
      .then(() => {
        message.success("Teacher deleted");
        fetchTeachers();
      });
  };

  const onFinish = (values) => {
    if (values.date_of_birth && values.date_of_birth.$y) {
      values.date_of_birth = values.date_of_birth.format("YYYY-MM-DD");
    }
    const api = editing
      ? apiClient.put(`http://localhost:8001/api/v1/teachers/${editing.id}`, values)
      : apiClient.post("http://localhost:8001/api/v1/teachers/", values);
    api.then(() => {
      message.success(editing ? "Teacher updated" : "Teacher added");
      setModal(false);
      fetchTeachers();
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
      <Button type="primary" style={{ marginBottom: 16 }} onClick={onAdd}>Add Teacher</Button>
      <Table
        columns={[...columns, actionCol]}
        dataSource={teachers}
        rowKey="id"
        loading={loading}
    
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? "Edit Teacher" : "Add Teacher"}
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
          <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
            <Select placeholder="Select gender">
              <Select.Option value="Male">Male</Select.Option>
              <Select.Option value="Female">Female</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="date_of_birth" label="Date of Birth" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>
          <Form.Item name="qualification" label="Qualification">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default TeacherTable;
