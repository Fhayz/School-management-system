import React, { useEffect, useState } from "react";
import { Card, Row, Col, Statistic } from "antd";
import { apiClient } from "../api";

function SuperAdminDashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Aggregate stats across all schools
    apiClient.get("/dashboard/school-summary/")  // Fixed typo and removed full URL
      .then(res => setSummary(res.data))
      .catch(err => setError(err.response?.data?.detail || err.message));
  }, []);

  return (
    <div>
      <h2 style={{ marginBottom: 24, fontWeight: 600 }}>System Overview</h2>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <Row gutter={24}>
        <Col span={6}><Card><Statistic title="Total Schools" value={summary?.total_schools || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Total Students" value={summary?.total_students || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Total Teachers" value={summary?.total_teachers || 0} /></Card></Col>
        <Col span={6}><Card><Statistic title="Total Classes" value={summary?.total_classes || 0} /></Card></Col>
      </Row>
    </div>
  );
}

export default SuperAdminDashboard;
