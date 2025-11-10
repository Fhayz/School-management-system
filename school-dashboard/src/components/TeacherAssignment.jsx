import React, { useEffect, useState } from "react";
import { Modal, Select, Form, message } from "antd";
import { apiClient} from "../api";

function TeacherAssignment({ classId, visible, onClose, currentTeachers, reloadClass }) {
  const [teacherIds, setTeacherIds] = useState(currentTeachers || []);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    apiClient.get("http://localhost:8001/api/v1/teachers/")
      .then(res => setTeacherOptions(res.data.map(t => ({
        label: `${t.first_name} ${t.last_name}`,
        value: t.id
      }))));
  }, []);

  useEffect(() => {
    setTeacherIds(currentTeachers || []);
  }, [currentTeachers]);

  const handleOk = () => {
    setConfirmLoading(true);
    apiClient.post(`http://localhost:8001/api/v1/classes/${classId}/assign-teachers/`, {
      teacher_ids: teacherIds
    }).then(() => {
        message.success("Teachers successfully assigned to class");
        setConfirmLoading(false);
        onClose();
        if (reloadClass) reloadClass();
      })
      .catch(() => setConfirmLoading(false));
  };

  return (
    <Modal
      title="Assign Teachers to Class"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText="Save"
    >
      <Form layout="vertical">
        <Form.Item label="Teachers">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Select teachers for this class"
            value={teacherIds}
            onChange={setTeacherIds}
            options={teacherOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default TeacherAssignment;
