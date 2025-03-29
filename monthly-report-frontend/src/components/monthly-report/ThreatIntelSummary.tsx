"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";

export const ThreatIntelSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.threat_intel_summary
  );
  return (
    <div>
      <div>
        <p
          style={{
            marginTop: 40,
            fontSize: "4.2rem",
            fontWeight: 700,
            color: "#090c9b",
            marginBottom: 0,
          }}
        >
          Threat Intel Summary
        </p>
        <p
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#090c9b",
            marginBottom: 0,
          }}
        >
          Advisory Count for the Month:
        </p>
        <div style={{ width: "60%", height: "200px", margin: "auto" }}>
          <GroupedBarChartHorizontal data={data.count_of_advisory_chart} />
        </div>
        <p
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#090c9b",
            marginBottom: 0,
          }}
        >
          Total IOC Sweep for the Month -{" "}
          {data.ioc_chart.datasets[0].data.reduce(
            (v: number, t: number) => t + v,
            0
          )}
        </p>
        <p
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#090c9b",
            marginBottom: 0,
          }}
        >
          Indicators of Compromise (IOC) Match against Sweep
        </p>
        <div style={{ width: "60%", height: "400px", margin: "auto" }}>
          <GroupedBarChartHorizontal data={data.ioc_chart} />
        </div>
      </div>
      <div style={{ marginTop: 40 }}>
        {data.ioc_match_details.data.length > 0 && (
          <div>
            <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
              Indicators of Compromise (IOC) Match Details
            </p>
            <table
              border={1}
              cellPadding={14}
              cellSpacing=""
              style={{
                width: "100%",
                borderCollapse: "collapse",
                borderColor: "#c6c6c9",
                textAlign: "center",
              }}
            >
              <thead>
                <tr style={{ color: "#090c9b", fontSize: 24 }}>
                  <th>Sr. No</th>
                  <th>Advisory Name</th>
                  <th>IOC Type</th>
                  <th>Detail</th>
                  <th>Endpoint Name/Email</th>
                </tr>
              </thead>
              <tbody>
                {data.ioc_match_details.data.map((j, k) => (
                  <tr
                    style={{ fontSize: 20, backgroundColor: "#ededed" }}
                    key={k}
                  >
                    <td>{k + 1}.</td>
                    <td>{j.advisory_name}</td>
                    <td>{j.ioc_type}</td>
                    <td>{j.detail}</td>
                    <td>{j.endpoint_name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data.ioc_investigation.data.length > 0 && (
          <table
            border={1}
            cellPadding={14}
            cellSpacing=""
            style={{
              marginTop: 24,
              width: "100%",
              borderCollapse: "collapse",
              borderColor: "#c6c6c9",
              textAlign: "center",
            }}
          >
            <thead>
              <tr style={{ color: "#090c9b", fontSize: 24 }}>
                <th>Sr. No</th>
                <th>Advisory Name</th>
                <th>About Advisory</th>
                <th>Investigation Summary</th>
              </tr>
            </thead>
            <tbody>
              {data.ioc_investigation.data.map((l, m) => (
                <tr
                  style={{ fontSize: 20, backgroundColor: "#ededed" }}
                  key={m}
                >
                  <td>{m + 1}.</td>
                  <td>{l.advisory_name}</td>
                  <td>{l.about_advisory}</td>
                  <td style={{ textAlign: "start", paddingLeft: 100 }}>
                    <strong>
                      Incident No: {l.investigation_summary.incident_no}
                      <br />
                      Incident Over View:{" "}
                      {l.investigation_summary.incident_overview}
                      <br />
                      Findings: {l.investigation_summary.findings}
                      <br />
                      Action Taken: {l.investigation_summary.action_taken}
                    </strong>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
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
        <div>
          <ul
            style={{
              listStyleType: "disc",
              paddingLeft: 20,
              marginBottom: "1rem",
            }}
          >
            {data.rsn.data.map((n, o) => (
              <li style={{ fontSize: 24 }} key={o}>
                {n}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
