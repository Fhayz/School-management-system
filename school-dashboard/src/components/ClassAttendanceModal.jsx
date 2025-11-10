import React, { useEffect, useState } from "react";
import { Modal, Table, DatePicker, Radio, Button, message } from "antd";
import { apiClient } from "../api";
import dayjs from "dayjs";

function ClassAttendanceModal({ classId, visible, onClose, reloadClass }) {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState({});
  const [date, setDate] = useState(dayjs());
  const [saving, setSaving] = useState(false);

  // Fetch students in class
  useEffect(() => {
    if (classId && visible) {
      apiClient.get(`http://localhost:8001/api/v1/classes/${classId}/students/`)
        .then(res => setStudents(res.data));
    }
  }, [classId, visible]);

  // Fetch attendance for selected date
  useEffect(() => {
    if (classId && date) {
      apiClient.get(`http://localhost:8001/api/v1/attendance/`, {
        params: {
          class_id: classId,
          date: date.format("YYYY-MM-DD")
        }
      }).then(res => {
        const att = {};
        res.data.forEach(row => {
          att[row.student_id] = row.status; // status: "Present" | "Absent"
        });
        setAttendance(att);
      });
    }
  }, [classId, date]);

  const markAttendance = (studentId, status) => {
    setAttendance(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const handleSave = () => {
    setSaving(true);
    apiClient.post(`http://localhost:8001/api/v1/attendance/mark/`, {
      class_id: classId,
      date: date.format("YYYY-MM-DD"),
      records: students.map(s => ({
        student_id: s.id,
        status: attendance[s.id] || "Absent" // Default to Absent if not set
      }))
    }).then(() => {
      message.success("Attendance saved");
      setSaving(false);
      if (reloadClass) reloadClass();
      onClose();
    }).catch(() => setSaving(false));
  };

  const columns = [
    { title: "Student", dataIndex: "full_name", key: "full_name", render: (text, record) => `${record.first_name} ${record.last_name}` },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (_, record) => (
        <Radio.Group
          value={attendance[record.id] || "Absent"}
          onChange={e => markAttendance(record.id, e.target.value)}
        >
          <Radio value="Present">Present</Radio>
          <Radio value="Absent">Absent</Radio>
        </Radio.Group>
      )
    }
  ];

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      title="Mark Attendance"
      footer={[
        <Button key="save" type="primary" onClick={handleSave} loading={saving}>
          Save Attendance
        </Button>
      ]}
      width={600}
    >
      <DatePicker
        style={{ marginBottom: 16 }}
        value={date}
        onChange={setDate}
        allowClear={false}
        format="YYYY-MM-DD"
      />
      <Table
        dataSource={students}
        columns={columns}
        rowKey="id"
        pagination={false}
        bordered
      />
    </Modal>
  );
}

export default ClassAttendanceModal;
