"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";

const TopRiskDevice = () => {
  const data = useAppSelector((state) => state.monthlyReport.top_risk_device);

  return (
    <div style={{ marginTop: 40 }} id="top_risk_devices">
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
        }}
      >
        Top Risk Device
      </p>
      <div style={{ width: "80%", height: 1000, margin: "auto" }}>
        <BarChartHorizontal data={data.risk_score_chart} />
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
        {data.rsn.data.map((item, i) => (
          <li style={{ fontSize: 24 }} key={i}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TopRiskDevice;
