import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
import { apiClient } from "../api";

function TeacherDashboard({ userId }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Teacher-specific stats and assigned classes
    apiClient.get("http://localhost:8001/api/v1/dashboard/teacher-summary/", { params: { teacher_id: userId } })
      .then(res => setSummary(res.data));
  }, [userId]);

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Your Teaching Overview</h2>
      <Row gutter={24}>
        <Col span={8}><Card><Statistic title="Classes Assigned" value={summary?.total_classes || 0} /></Card></Col>
        <Col span={8}><Card><Statistic title="Students" value={summary?.total_students || 0} /></Card></Col>
        <Col span={8}><Card><Statistic title="Subjects Taught" value={summary?.total_subjects || 0} /></Card></Col>
      </Row>
      {summary?.recent_results && (
        <div style={{ marginTop: 32 }}>
          <h3>Recent Results</h3>
          <Table
            columns={[
              { title: "Student", dataIndex: "student_name", key: "student_name" },
              { title: "Class", dataIndex: "class_name", key: "class_name" },
              { title: "Subject", dataIndex: "subject_name", key: "subject_name" },
              { title: "Score", dataIndex: "score", key: "score" }
            ]}
            dataSource={summary.recent_results}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </div>
      )}
    </div>
  );
}

export default TeacherDashboard;
