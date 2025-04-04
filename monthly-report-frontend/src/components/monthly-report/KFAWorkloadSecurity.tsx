"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";

const KFAWorkloadSecurity = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.key_feature_adoption_server_workload
  );

  return (
    <div
      style={{ marginTop: 40 }}
      id="key_feature_adoption_rate_of_server_workload_security"
    >
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
      <div style={{ width: "auto", height: 1000, margin: "auto" }}>
        {/* <canvas style={{ marginTop: 10 }} id="myChart2" /> */}
        <GroupedBarChartHorizontal data={data.workload_security_chart} />
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

export default KFAWorkloadSecurity;
