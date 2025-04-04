"use client";

import { useAppSelector } from "@@/lib/hooks";

const PendingIncidentsSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.pending_incident_summary.data
  );
  return (
    <div id="waiting_incidents_summary">
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
          marginBottom: 0,
        }}
      >
        Pending Incidents Summary
      </p>
      <table
        border={1}
        cellPadding={14}
        cellSpacing=""
        style={{
          marginTop: 24,
          width: "100%",
          borderCollapse: "collapse",
          borderColor: "#c6c6c9",
          textAlign: "center",
        }}
      >
        <thead>
          <tr style={{ color: "#090c9b", fontSize: 24 }}>
            <th>Incident Names</th>
            <th style={{ whiteSpace: "nowrap" }}>Priority</th>
            <th>Date of Occurrence</th>
            <th>Severity</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, i) => (
            <tr
              style={{
                fontSize: 20,
                backgroundColor: i % 2 === 0 ? "#ededed" : "#ffff",
              }}
              key={i}
            >
              <td style={{ textAlign: "start" }}>{item.incident_name}</td>
              <td>{item.priority}</td>
              <td>{item.no_of_occurrence}</td>
              <td>{item.severity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PendingIncidentsSummary;
