import React, { useEffect, useState } from "react";
import { Modal, Select, Form, message } from "antd";
import { apiClient} from "../api";

function SubjectAssignment({ subjectId, visible, onClose, currentTeachers, reloadSubjects }) {
  const [teacherIds, setTeacherIds] = useState(currentTeachers || []);
  const [teacherOptions, setTeacherOptions] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    apiClient.get("http://localhost:8000/api/v1/teachers/")
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
    apiClient.post(`http://localhost:8000/api/v1/subjects/${subjectId}/assign-teachers/`, {
      teacher_ids: teacherIds
    }).then(() => {
        message.success("Teachers assigned to subject");
        setConfirmLoading(false);
        onClose();
        if (reloadSubjects) reloadSubjects();
      })
      .catch(() => setConfirmLoading(false));
  };

  return (
    <Modal
      title="Assign Teachers to Subject"
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
            placeholder="Select teachers for this subject"
            value={teacherIds}
            onChange={setTeacherIds}
            options={teacherOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default SubjectAssignment;
