import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { apiClient } from "../api";

const columns = [
  { title: "Subject Name", dataIndex: "name", key: "name" },
  { title: "Code", dataIndex: "code", key: "code" },
  { title: "Description", dataIndex: "description", key: "description" }
];

function SubjectTable() {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = () => {
    setLoading(true);
    apiClient.get("http://localhost:8001/api/v1/subjects/")
      .then(res => setSubjects(res.data))
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
    apiClient.delete(`http://localhost:8001/api/v1/subjects/${id}`)
      .then(() => {
        message.success("Subject deleted");
        fetchSubjects();
      });
  };

  const onFinish = (values) => {
    const api = editing
      ? apiClient.put(`http://localhost:8001/api/v1/subjects/${editing.id}`, values)
      : apiClient.post("http://localhost:8001/api/v1/subjects/", values);
    api.then(() => {
      message.success(editing ? "Subject updated" : "Subject added");
      setModal(false);
      fetchSubjects();
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
      <Button type="primary" style={{ marginBottom: 16 }} onClick={onAdd}>Add Subject</Button>
      <Table
        columns={[...columns, actionCol]}
        dataSource={subjects}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editing ? "Edit Subject" : "Add Subject"}
        open={modal}
        onCancel={() => setModal(false)}
        onOk={() => form.submit()}
        okText={editing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Subject Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="code" label="Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}

export default SubjectTable;
