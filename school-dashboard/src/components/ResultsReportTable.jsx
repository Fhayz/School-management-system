import React, { useEffect, useState } from "react";
import { Table, Select, Button, message } from "antd";
import {apiClient } from "../api";
import { DownloadOutlined } from "@ant-design/icons";

function ResultsReportTable() {
  const [classes, setClasses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [selectedSubjectId, setSelectedSubjectId] = useState(null);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiClient.get("http://localhost:8000/api/v1/classes/")
      .then(res => setClasses(res.data));
    apiClient.get("http://localhost:8000/api/v1/subjects/")
      .then(res => setSubjects(res.data));
  }, []);

  useEffect(() => {
    if (selectedClassId && selectedSubjectId) {
      setLoading(true);
      apiClient.get("http://localhost:8000/api/v1/results/", {
        params: {
          class_id: selectedClassId,
          subject_id: selectedSubjectId
        }
      })
      .then(res => setResults(res.data))
      .finally(() => setLoading(false));
    }
  }, [selectedClassId, selectedSubjectId]);

  const handleExportCSV = () => {
    if (!selectedClassId || !selectedSubjectId) return;
    apiClient.get("http://localhost:8000/api/v1/results/export/", {
      params: {
        class_id: selectedClassId,
        subject_id: selectedSubjectId
      },
      responseType: "blob" // get CSV file
    }).then(res => {
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "results.csv");
      document.body.appendChild(link);
      link.click();
      message.success("CSV exported!");
    });
  };

  const columns = [
    { title: "Student Name", dataIndex: "student_name", key: "student_name" },
    { title: "Score", dataIndex: "score", key: "score" },
    { title: "Class", dataIndex: "class_name", key: "class_name" },
    { title: "Subject", dataIndex: "subject_name", key: "subject_name" }
  ];

  return (
    <div>
      <div style={{ marginBottom: 16, display: "flex", gap: 16 }}>
        <Select
          style={{ width: 200 }}
          placeholder="Select Class"
          value={selectedClassId}
          onChange={setSelectedClassId}
          options={classes.map(cls => ({
            label: cls.name,
            value: cls.id
          }))}
        />
        <Select
          style={{ width: 200 }}
          placeholder="Select Subject"
          value={selectedSubjectId}
          onChange={setSelectedSubjectId}
          options={subjects.map(sub => ({
            label: sub.name,
            value: sub.id
          }))}
        />
        <Button
          icon={<DownloadOutlined />}
          type="primary"
          disabled={!selectedClassId || !selectedSubjectId}
          onClick={handleExportCSV}
        >
          Export CSV
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={results}
        loading={loading}
        rowKey="student_id"
        bordered
      />
    </div>
  );
}

export default ResultsReportTable;
