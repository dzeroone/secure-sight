"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";

const SLOSummary = () => {
  const data = useAppSelector((state) => state.monthlyReport.slo_summary);
  return (
    <div id={data.id}>
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
        }}
      >
        SLO Summary
      </p>
      <div
        style={{
          width: "80%",
          height: Math.min(75 + data.slo_chart.key.length * 70, 1000),
          margin: "0 auto",
          display: "grid",
          placeItems: "center",
        }}
      >
        <BarChartHorizontal data={data.slo_chart} />
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
          Service Level Objective (SLO)
        </p>
        <div>
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
                <th>Description</th>
                <th style={{ whiteSpace: "nowrap" }}>Response Time</th>
              </tr>
            </thead>
            <tbody>
              {data.slo_table.map((item, i) => (
                <tr
                  style={{
                    fontSize: 20,
                    backgroundColor: i % 2 === 0 ? "#ededed" : "#ffffff",
                  }}
                  key={i}
                >
                  <td>{item.priority}</td>
                  <td style={{ textAlign: "start" }}>{item.description}</td>
                  <td>{item.response_time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SLOSummary;
