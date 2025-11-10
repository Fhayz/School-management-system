import React, { useEffect, useState } from "react";
import { Button, Modal, Select, Form, message } from "antd";
import { apiClient } from "../api";

function ClassEnrollment({ classId, visible, onClose, currentStudents, reloadClass }) {
  const [studentIds, setStudentIds] = useState(currentStudents || []);
  const [studentOptions, setStudentOptions] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    // Fetch student list
    apiClient.get("http://localhost:8001/api/v1/students/")
      .then(res => setStudentOptions(res.data.map(s => ({
        label: `${s.first_name} ${s.last_name}`,
        value: s.id
      }))));
  }, []);

  useEffect(() => {
    setStudentIds(currentStudents || []);
  }, [currentStudents]);

  const handleOk = () => {
    setConfirmLoading(true);
    apiClient.post(`http://localhost:8001/api/v1/classes/${classId}/enroll/`, {
      student_ids: studentIds
    }).then(() => {
        message.success("Class enrollments updated");
        setConfirmLoading(false);
        onClose();
        reloadClass(); // Refresh class data if provided
      })
      .catch(() => setConfirmLoading(false));
  };

  return (
    <Modal
      title="Assign Students to This Class"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText="Save"
    >
      <Form layout="vertical">
        <Form.Item label="Students">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Select students for this class"
            value={studentIds}
            onChange={setStudentIds}
            options={studentOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ClassEnrollment;
