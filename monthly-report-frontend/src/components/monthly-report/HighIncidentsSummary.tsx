"use client";

import { useAppSelector } from "@@/lib/hooks";

const HighIncidentsSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.high_incident_summary
  );

  return (
    <div id="high_incidents_summary">
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
          marginBottom: 0,
        }}
      >
        Critical/High Incidents Summary
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
            <th>Priority</th>
            <th style={{ whiteSpace: "nowrap" }}>Incident Title</th>
            <th>Findings and Actioned Performed</th>
          </tr>
        </thead>
        <tbody>
          {data.data.map((item, i) => (
            <tr
              style={{
                fontSize: 20,
                backgroundColor: i % 2 === 0 ? "#f2f2f2" : "",
              }}
              key={i}
            >
              <td>{item.priority}</td>
              <td style={{ textAlign: "start" }}>{item.incident_title}</td>
              <td>
                <ul style={{ textAlign: "justify", marginRight: 10 }}>
                  <li style={{ marginBottom: "1rem" }}>
                    <strong>Overview:</strong> {item.findings.overview}
                  </li>
                  <li style={{ marginBottom: "1rem" }}>
                    <strong>Endpoint Host Name:</strong>
                    {item.findings.endpoint_host_name}
                  </li>
                  <li style={{ marginBottom: "1rem" }}>
                    <strong>Detected By:</strong> {item.findings.detected_by}
                  </li>
                  <li style={{ marginBottom: "1rem" }}>
                    <strong>Action Performed:</strong>{" "}
                    {item.findings.action_performed}
                  </li>
                </ul>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HighIncidentsSummary;
