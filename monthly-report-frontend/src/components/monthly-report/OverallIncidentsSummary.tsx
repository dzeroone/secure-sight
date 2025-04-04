"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";

const OverallIncidentsSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.overall_incident_summary
  );

  return (
    <div id="incidents_summary">
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
          marginBottom: 0,
        }}
      >
        Overall Incidents Summary
      </p>
      <div style={{ width: "80%", height: "300px", margin: "auto" }}>
        <BarChartHorizontal data={data.incidents_chart} />
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
          P1 - Critical Severity Incidents
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 54, fontWeight: "bold", color: "#090c9b" }}>
            {data.p1.total_incidents}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p1.closed_with_resolution}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p1.closed_without_resolution}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p1.pending_with_customer.pending_incidents}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p1.pending_with_soc_team}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#ededed",
              fontSize: 18,
              fontWeight: "bold",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Total <br /> Incidents
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Incidents Closed with
            <br />
            Resolution
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: "30px 25px",
            }}
          >
            Incidents Closed without Acknowledgment
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Pending Incidents with {data.p1.pending_with_customer.customer_name}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Pending Incidents with SOC Team
          </div>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
          P2 - High Severity Incidents
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 54, fontWeight: "bold", color: "#090c9b" }}>
            {data.p2.total_incidents}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p2.closed_with_resolution}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p2.closed_without_resolution}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p2.pending_with_customer.pending_incidents}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p2.pending_with_soc_team}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#ededed",
              fontSize: 18,
              fontWeight: "bold",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Total <br /> Incidents
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Incidents Closed with
            <br />
            Resolution
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: "30px 25px",
            }}
          >
            Incidents Closed without Acknowledgment
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Pending Incidents with {data.p2.pending_with_customer.customer_name}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Pending Incidents with SOC Team
          </div>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
          P3- Medium Severity Incidents
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 54, fontWeight: "bold", color: "#090c9b" }}>
            {data.p3.total_incidents}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p3.closed_with_resolution}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p3.closed_without_resolution}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p3.pending_with_customer.pending_incidents}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p3.pending_with_soc_team}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#ededed",
              fontSize: 18,
              fontWeight: "bold",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Total <br /> Incidents
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Incidents Closed with
            <br />
            Resolution
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: "30px 25px",
            }}
          >
            Incidents Closed without Acknowledgment
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Pending Incidents with {data.p3.pending_with_customer.customer_name}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Pending Incidents with SOC Team
          </div>
        </div>
      </div>
      <div>
        <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
          P4 – Low Severity Incidents
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div style={{ fontSize: 54, fontWeight: "bold", color: "#090c9b" }}>
            {data.p4.total_incidents}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p4.closed_with_resolution}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p4.closed_without_resolution}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p4.pending_with_customer.pending_incidents}
          </div>
          <div style={{ fontSize: 54, fontWeight: 500, color: "#6b6c86" }}>
            {data.p4.pending_with_soc_team}
          </div>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: 0,
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              backgroundColor: "#ededed",
              fontSize: 18,
              fontWeight: "bold",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Total <br /> Incidents
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Incidents Closed with
            <br />
            Resolution
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: "30px 25px",
            }}
          >
            Incidents Closed without Acknowledgment
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderRight: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Pending Incidents with {data.p4.pending_with_customer.customer_name}
          </div>
          <div
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#090c9b",
              border: "2px dashed #090c9b",
              borderLeft: "none",
              boxSizing: "border-box",
              padding: 30,
            }}
          >
            Pending Incidents with SOC Team
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverallIncidentsSummary;
