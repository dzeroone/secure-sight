"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";
import { CHART_EXTRAS } from "@@/constants";

const KFADeepSecurity = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.key_feature_adoption_deep_security
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
        Key Feature Adoption Rate of Deep Security
      </p>
      <div
        style={{
          width: "auto",
          height: Math.min(
            CHART_EXTRAS.LEGEND_HEIGHT +
              data.deep_security_chart.key.length * CHART_EXTRAS.HEIGHT_PER_KEY,
            1000
          ),
          margin: "auto",
        }}
      >
        <GroupedBarChartHorizontal data={data.deep_security_chart} />
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default KFADeepSecurity;
