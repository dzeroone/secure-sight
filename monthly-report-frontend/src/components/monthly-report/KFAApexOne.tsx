"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";

const KFAApexOne = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.key_feature_adoption_apex_one
  );

  return (
    <div style={{ marginTop: 40 }} id={data.id}>
      <p
        style={{
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
          marginBottom: 0,
        }}
      >
        Key Feature Adoption Rate of Apex one as Service / Std Endpoint
        Protection
      </p>
      <div
        style={{
          width: "auto",
          height: Math.min(75 + data.apex_one_chart.key.length * 90, 1000),
          margin: "auto",
        }}
      >
        <GroupedBarChartHorizontal data={data.apex_one_chart} />
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default KFAApexOne;
