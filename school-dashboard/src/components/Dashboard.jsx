import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { apiClient } from "../api"; // Make sure the import path matches your project

function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/dashboard/school-summary/")
      .then(res => setSummary(res.data))
      .catch(err =>
        setError(
          err.response?.data?.detail ||
          err.message ||
          "Error fetching data."
        )
      );
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>School Overview</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Row gutter={24}>
        <Col span={6}><Card><Statistic title="Students" value={summary?.total_students || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Teachers" value={summary?.total_teachers || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Classes" value={summary?.total_classes || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Subjects" value={summary?.total_subjects || 0} /></Card></Col>
      </Row>
    </div>
  );
}

export default Dashboard;
