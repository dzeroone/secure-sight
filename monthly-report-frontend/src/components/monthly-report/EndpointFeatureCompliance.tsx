"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";

const EndpointFeatureCompliance = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.endpoint_feature_compliance
  );

  return (
    <div style={{ marginTop: 40 }} id={data.id}>
      <p style={{ fontSize: "4.2rem", fontWeight: 700, color: "#090c9b" }}>
        Endpoint Feature <br />
        Compliance
      </p>
      <div
        style={{
          width: 800,
          height: Math.min(75 + data.compliance_chart.key.length * 70, 1000),
          margin: "auto",
        }}
      >
        {/* <canvas style={{ marginTop: 10 }} id="horizontalBarCharts10" /> */}
        <BarChartHorizontal data={data.compliance_chart} />
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default EndpointFeatureCompliance;
