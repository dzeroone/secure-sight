"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";
import { CHART_EXTRAS } from "@@/constants";

const TopRiskUsers = () => {
  const data = useAppSelector((state) => state.monthlyReport.top_risk_users);

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
        Top Risk Users
      </p>
      <div
        style={{
          width: "80%",
          height: Math.min(
            CHART_EXTRAS.LEGEND_HEIGHT +
              data.risk_score_chart.key.length * CHART_EXTRAS.HEIGHT_PER_KEY,
            1000
          ),
          margin: "auto",
        }}
      >
        <BarChartHorizontal data={data.risk_score_chart} />
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default TopRiskUsers;
