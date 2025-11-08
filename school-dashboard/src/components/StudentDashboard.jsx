import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic, Table } from "antd";
import { apiClient } from "../api";

function StudentDashboard({ userId }) {
  const [summary, setSummary] = useState(null);

  useEffect(() => {
    // Student-specific attendance and results
    apiClient.get("http://localhost:8001/api/v1/dashboard/student-summary/", { params: { student_id: userId } })
      .then(res => setSummary(res.data));
  }, [userId]);

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>Your Academic Overview</h2>
      <Row gutter={24}>
        <Col span={8}><Card><Statistic title="Attendance %" value={summary?.attendance_rate ? `${summary.attendance_rate}%` : "-"} /></Card></Col>
        <Col span={8}><Card><Statistic title="Average Score" value={summary?.avg_score || "-"} suffix="/100" /></Card></Col>
        <Col span={8}><Card><Statistic title="Class" value={summary?.class_name || "-"} /></Card></Col>
      </Row>
      {summary?.recent_results && (
        <div style={{ marginTop: 32 }}>
          <h3>Recent Results</h3>
          <Table
            columns={[
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

export default StudentDashboard;
