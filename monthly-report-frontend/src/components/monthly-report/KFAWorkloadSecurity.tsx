"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";

const KFAWorkloadSecurity = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.key_feature_adoption_server_workload
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
        Key feature adoption rate of C1WS / server &amp; workload security /
        protection
      </p>
      <div
        style={{
          width: "auto",
          height: Math.min(
            75 + data.workload_security_chart.key.length * 70,
            1000
          ),
          margin: "auto",
        }}
      >
        {/* <canvas style={{ marginTop: 10 }} id="myChart2" /> */}
        <GroupedBarChartHorizontal data={data.workload_security_chart} />
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default KFAWorkloadSecurity;
