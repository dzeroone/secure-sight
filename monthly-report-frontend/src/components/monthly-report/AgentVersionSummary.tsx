"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import PieChart from "../charts/PieChart";
import RecommendationNotes from "../RecommendationNotes";

const AgentVersionSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.agent_versions_summary
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
          <div style={{ width: "80%", height: 300, margin: "auto" }}>
            <PieChart data={data.agent_version_chart} />
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
            {data.server_workload_protection_chart.title}
          </p>
          <div
            style={{
              width: 600,
              height: Math.min(
                75 + data.server_workload_protection_chart.key.length * 90,
                1000
              ),
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
            {data.standard_endpoint_protection_chart.title}
          </p>
          <div
            style={{
              width: 600,
              height: Math.min(
                data.standard_endpoint_protection_chart.key.length * 90,
                1000
              ),
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
