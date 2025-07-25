"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import VerticalBarChart2 from "../charts/VerticalBarChart2";
import RecommendationNotes from "../RecommendationNotes";

const AgentVersionSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.agent_versions_summary
  );

  const dsData = useAppSelector(
    (state) => state.monthlyReport.deep_security
  );

  return (
    <div id={data.id}>
      <p
        style={{
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
          marginBottom: 0,
        }}
      >
        Agent Versions Summary
      </p>
      {data.agent_version_chart.visible && (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div style={{ width: "80%", height: 400, margin: "auto" }}>
            <VerticalBarChart2 data={data.agent_version_chart} />
            {/* <PieChart data={data.agent_version_chart} /> */}
          </div>
        </div>
      )}
      {dsData.server_workload_protection_chart.visible && (
        <div>
          <p
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "#090c9b",
              marginBottom: 0,
            }}
          >
            Deep Security
          </p>
          <div
            style={{
              width: 600,
              height: 400,
              margin: "auto",
            }}
          >
            <BarChartHorizontal data={dsData.server_workload_protection_chart} />
          </div>
        </div>
      )}
      {data.server_workload_protection_chart.visible && (
        <div>
          <p
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "#090c9b",
              marginBottom: 0,
            }}
          >
            C1WS / Server & Workload Security / Protection
          </p>
          <div
            style={{
              width: 600,
              height: 400,
              margin: "auto",
            }}
          >
            <BarChartHorizontal data={data.server_workload_protection_chart} />
          </div>
        </div>
      )}
      {data.standard_endpoint_protection_chart.visible && (
        <div>
          <p
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "#090c9b",
              marginBottom: 0,
            }}
          >
            Apex one as Service / Std Endpoint Protection
          </p>
          <div
            style={{
              width: 600,
              height: 400,
              margin: "auto",
            }}
          >
            <BarChartHorizontal
              data={data.standard_endpoint_protection_chart}
            />
          </div>
        </div>
      )}
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default AgentVersionSummary;
