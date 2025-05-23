"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";
import { CHART_EXTRAS } from "@@/constants";

const TopVulnerabilitiesDetected = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.top_vulnerabilities_detected
  );

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
        Top Vulnerabilities <br />
        Detected
      </p>
      <div
        style={{
          width: "80%",
          height: Math.min(
            CHART_EXTRAS.LEGEND_HEIGHT +
              data.impact_chart.key.length * CHART_EXTRAS.HEIGHT_PER_KEY,
            1000
          ),
          margin: "auto",
        }}
      >
        <GroupedBarChartHorizontal data={data.impact_chart} />
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default TopVulnerabilitiesDetected;
