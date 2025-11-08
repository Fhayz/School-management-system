import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Popconfirm, message } from "antd";
import { apiClient} from "../api";
import ClassEnrollment from "./ClassEnrollment";
import TeacherAssignment from "./TeacherAssignment";
import ClassSubjectAssignment from "./ClassSubjectAssignment";
import ClassAttendanceModal from "./ClassAttendanceModal"; // NEW

const columns = [
  { title: "Class Name", dataIndex: "name", key: "name" },
  { title: "Description", dataIndex: "description", key: "description" }
];

function ClassTable() {
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  // Enrollment modal states
  const [enrollmentVisible, setEnrollmentVisible] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [currentClassStudents, setCurrentClassStudents] = useState([]);

  // Teacher assignment modal states
  const [teacherModalVisible, setTeacherModalVisible] = useState(false);
  const [selectedClassIdForTeacher, setSelectedClassIdForTeacher] = useState(null);
  const [currentClassTeachers, setCurrentClassTeachers] = useState([]);

  // Subjects assignment modal states
  const [subjectModalVisible, setSubjectModalVisible] = useState(false);
  const [selectedClassIdForSubject, setSelectedClassIdForSubject] = useState(null);
  const [currentClassSubjects, setCurrentClassSubjects] = useState([]);

  // Attendance modal states
  const [attendanceModalVisible, setAttendanceModalVisible] = useState(false);
  const [selectedClassIdForAttendance, setSelectedClassIdForAttendance] = useState(null);

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = () => {
    setLoading(true);
    apiClient.get("http://localhost:8001/api/v1/classes/")
      .then(res => setClasses(res.data))
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
    apiClient.delete(`http://localhost:8001/api/v1/classes/${id}`)
      .then(() => {
        message.success("Class deleted");
        fetchClasses();
      });
  };

  const onFinish = (values) => {
    const api = editing
      ? apiClient.put(`http://localhost:8001/api/v1/classes/${editing.id}`, values)
      : apiClient.post("http://localhost:8001/api/v1/classes/", values);
    api.then(() => {
      message.success(editing ? "Class updated" : "Class added");
      setModal(false);
      fetchClasses();
    });
  };

  // For ClassEnrollment modal
  const openEnrollment = (record) => {
    setSelectedClassId(record.id);
    setCurrentClassStudents(record.students ? record.students.map(s => s.id) : []);
    setEnrollmentVisible(true);
  };

  // For TeacherAssignment modal
  const openTeacherAssignment = (record) => {
    setSelectedClassIdForTeacher(record.id);
    setCurrentClassTeachers(record.teachers ? record.teachers.map(t => t.id) : []);
    setTeacherModalVisible(true);
  };

  // For SubjectAssignment modal
  const openSubjectAssignment = (record) => {
    setSelectedClassIdForSubject(record.id);
    setCurrentClassSubjects(record.subjects ? record.subjects.map(s => s.id) : []);
    setSubjectModalVisible(true);
  };

  // For ClassAttendance modal
  const openAttendanceModal = (record) => {
    setSelectedClassIdForAttendance(record.id);
    setAttendanceModalVisible(true);
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
        <Button type="dashed" onClick={() => openEnrollment(record)}>
          Assign Students
        </Button>
        <Button type="dashed" onClick={() => openTeacherAssignment(record)}>
          Assign Teachers
        </Button>
        <Button type="dashed" onClick={() => openSubjectAssignment(record)}>
          Assign Subjects
        </Button>
        <Button type="dashed" onClick={() => openAttendanceModal(record)}>
          Attendance
        </Button>
      </Space>
    ),
  };

  return (
    <div>
      <Button type="primary" style={{ marginBottom: 16 }} onClick={onAdd}>Add Class</Button>
      <Table
        columns={[...columns, actionCol]}
        dataSource={classes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
      <Modal
        title={editing ? "Edit Class" : "Add Class"}
        open={modal}
        onCancel={() => setModal(false)}
        onOk={() => form.submit()}
        okText={editing ? "Update" : "Add"}
      >
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="name" label="Class Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Description">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
      <ClassEnrollment
        classId={selectedClassId}
        visible={enrollmentVisible}
        onClose={() => setEnrollmentVisible(false)}
        currentStudents={currentClassStudents}
        reloadClass={fetchClasses}
      />
      <TeacherAssignment
        classId={selectedClassIdForTeacher}
        visible={teacherModalVisible}
        onClose={() => setTeacherModalVisible(false)}
        currentTeachers={currentClassTeachers}
        reloadClass={fetchClasses}
      />
      <ClassSubjectAssignment
        classId={selectedClassIdForSubject}
        visible={subjectModalVisible}
        onClose={() => setSubjectModalVisible(false)}
        currentSubjects={currentClassSubjects}
        reloadClass={fetchClasses}
      />
      <ClassAttendanceModal
        classId={selectedClassIdForAttendance}
        visible={attendanceModalVisible}
        onClose={() => setAttendanceModalVisible(false)}
        reloadClass={fetchClasses}
      />
    </div>
  );
}

export default ClassTable;
