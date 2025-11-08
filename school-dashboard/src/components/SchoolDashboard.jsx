import React, { useEffect, useState } from "react";
import { Row, Col, Card, Statistic, Table, Progress, message } from "antd";
import { apiClient } from "../api";

function SchoolDashboard({ userRole, userId }) {
  const [stats, setStats] = useState({});
  const [topStudents, setTopStudents] = useState([]);
  const [recentAbsentees, setRecentAbsentees] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiClient.get("http://localhost:8001/api/v1/dashboard/", { params: { role: userRole, user_id: userId } })
      .then(res => {
        setStats(res.data.stats);
        setTopStudents(res.data.top_students || []);
        setRecentAbsentees(res.data.absentees || []);
      })
      .catch(() => message.error("Dashboard data error"))
      .finally(() => setLoading(false));
  }, [userRole, userId]);

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={6}>
          <Card>
            <Statistic title="Total Students" value={stats.total_students || "-"} loading={loading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="Total Classes" value={stats.total_classes || "-"} loading={loading} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Attendance Rate (%)"
              value={stats.attendance_rate ? stats.attendance_rate.toFixed(1) : "-"}
              suffix="%"
              loading={loading}
            />
            <Progress percent={stats.attendance_rate} showInfo={false} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Average Score"
              value={stats.avg_score ? stats.avg_score.toFixed(1) : "-"}
              suffix="/100"
              loading={loading}
            />
            <Progress percent={stats.avg_score} showInfo={false} />
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]} style={{ marginTop: 32 }}>
        <Col span={12}>
          <Card title="Top Students" loading={loading}>
            <Table
              columns={[
                { title: "Name", dataIndex: "name", key: "name" },
                { title: "Class", dataIndex: "class_name", key: "class_name" },
                { title: "Score", dataIndex: "score", key: "score" }
              ]}
              dataSource={topStudents}
              rowKey="student_id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Recent Absentees" loading={loading}>
            <Table
              columns={[
                { title: "Name", dataIndex: "name", key: "name" },
                { title: "Class", dataIndex: "class_name", key: "class_name" },
                { title: "Date", dataIndex: "date", key: "date" }
              ]}
              dataSource={recentAbsentees}
              rowKey="student_id"
              pagination={{ pageSize: 5 }}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default SchoolDashboard;
