"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";

const TopRiskDevice = () => {
  const data = useAppSelector((state) => state.monthlyReport.top_risk_device);

  return (
    <div style={{ marginTop: 40 }} id={data.id}>
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
      <div
        style={{
          width: "80%",
          height:
            data.risk_score_chart.key.length > 5
              ? 1000
              : data.risk_score_chart.key.length * 100,
          margin: "auto",
        }}
      >
        <BarChartHorizontal data={data.risk_score_chart} />
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default TopRiskDevice;
