"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";

const TopVulnerabilitiesDetected = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.top_vulnerabilities_detected
  );

  return (
    <div style={{ marginTop: 40 }}>
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
        }}
      >
        Top Vulnerabilities <br />
        Detected
      </p>
      <div style={{ width: "80%", height: 1000, margin: "auto" }}>
        <GroupedBarChartHorizontal data={data.impact_chart} />
      </div>
      <p
        style={{
          fontSize: 26,
          fontWeight: "bold",
          color: "#090c9b",
          marginBottom: 0,
        }}
      >
        {data.rsn.key}
      </p>
      <ul>
        {data.rsn.data.map((item: string, index: number) => (
          <li key={index} style={{ fontSize: 24 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopVulnerabilitiesDetected;
