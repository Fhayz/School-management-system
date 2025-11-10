import React, { useEffect, useState } from "react";
import { Modal, Select, Form, message } from "antd";
import { apiClient } from "../api";

function ClassSubjectAssignment({ classId, visible, onClose, currentSubjects, reloadClass }) {
  const [subjectIds, setSubjectIds] = useState(currentSubjects || []);
  const [subjectOptions, setSubjectOptions] = useState([]);
  const [confirmLoading, setConfirmLoading] = useState(false);

  useEffect(() => {
    apiClient.get("http://localhost:8001/api/v1/subjects/")
      .then(res => setSubjectOptions(res.data.map(s => ({
        label: `${s.name} (${s.code})`,
        value: s.id
      }))));
  }, []);

  useEffect(() => {
    setSubjectIds(currentSubjects || []);
  }, [currentSubjects]);

  const handleOk = () => {
    setConfirmLoading(true);
    apiClient.post(`http://localhost:8001/api/v1/classes/${classId}/assign-subjects/`, {
      subject_ids: subjectIds
    }).then(() => {
        message.success("Subjects assigned to class");
        setConfirmLoading(false);
        onClose();
        if (reloadClass) reloadClass();
      })
      .catch(() => setConfirmLoading(false));
  };

  return (
    <Modal
      title="Assign Subjects to Class"
      open={visible}
      onCancel={onClose}
      onOk={handleOk}
      confirmLoading={confirmLoading}
      okText="Save"
    >
      <Form layout="vertical">
        <Form.Item label="Subjects">
          <Select
            mode="multiple"
            allowClear
            style={{ width: '100%' }}
            placeholder="Select subjects for this class"
            value={subjectIds}
            onChange={setSubjectIds}
            options={subjectOptions}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default ClassSubjectAssignment;
