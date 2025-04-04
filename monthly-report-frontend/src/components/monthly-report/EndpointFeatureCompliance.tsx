"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";

const EndpointFeatureCompliance = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.endpoint_feature_compliance
  );

  return (
    <div style={{ marginTop: 40 }} id="endpoint_feature_compliance">
      <p style={{ fontSize: "4.2rem", fontWeight: 700, color: "#090c9b" }}>
        Endpoint Feature <br />
        Compliance
      </p>
      <div style={{ width: 800, height: 300, margin: "auto" }}>
        {/* <canvas style={{ marginTop: 10 }} id="horizontalBarCharts10" /> */}
        <BarChartHorizontal data={data.compliance_chart} />
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
        {data.rsn.data.map((item: any, index: number) => (
          <li key={index} style={{ fontSize: 24 }}>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EndpointFeatureCompliance;
