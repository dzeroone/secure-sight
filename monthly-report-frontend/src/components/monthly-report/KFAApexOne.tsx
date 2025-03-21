"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";

const KFAApexOne = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.key_feature_adoption_apex_one
  );

  return (
    <div style={{ marginTop: 40 }}>
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
      <div style={{ width: "auto", height: 1000, margin: "auto" }}>
        <GroupedBarChartHorizontal data={data.apex_one_chart} />
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

export default KFAApexOne;
