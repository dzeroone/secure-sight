"use client";

import { useAppSelector } from "@@/lib/hooks";
import GroupedBarChartHorizontal from "../charts/GroupedBarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";
import { CHART_EXTRAS } from "@@/constants";
import { Box, Divider, Typography } from "@mui/material";

export const ThreatIntelSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.threat_intel_summary
  );
  return (
    <div id={data.id}>
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
        <div
          style={{
            width: "60%",
            height: Math.min(
              CHART_EXTRAS.LEGEND_HEIGHT +
                data.count_of_advisory_chart.key.length *
                  CHART_EXTRAS.HEIGHT_PER_KEY,
              1000
            ),
            margin: "auto",
          }}
        >
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
          Total IOC Sweep for the Month - {data.total_ioc_sweep}
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
        <div
          style={{
            width: "60%",
            height: Math.min(
              CHART_EXTRAS.LEGEND_HEIGHT +
                data.ioc_chart.key.length * CHART_EXTRAS.HEIGHT_PER_KEY,
              1000
            ),
            margin: "auto",
          }}
        >
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
                    <Typography
                      component="td"
                      variant="inherit"
                      sx={{ wordBreak: "break-all" }}
                    >
                      {j.detail}
                    </Typography>
                    <td
                      style={{
                        wordBreak: "break-all",
                      }}
                    >
                      {j.endpoint_name}
                    </td>
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
            }}
          >
            <tbody>
              {data.ioc_investigation.data.map((l, m) => (
                <tr
                  style={{ fontSize: 20, backgroundColor: "#ededed" }}
                  key={m}
                >
                  <Box component="td" width="3rem">{m + 1}.</Box>
                  <td style={{ wordBreak: 'break-word' }}>
                    <Box display="flex" flexDirection="column" gap={2}>
                      <div><strong>Advisory Name: </strong>{l.advisory_name}</div>
                      <div><strong>About Advisory: </strong><br />{l.about_advisory}</div>
                      <Divider sx={{ w: '100%' }} />
                      <div><strong>Investigation Summary: </strong></div>
                      <div><strong>Incident No: </strong>{l.investigation_summary.incident_no}</div>
                      <div><strong>Incident Overview: </strong>{l.investigation_summary.incident_overview}</div>
                      <div><strong>Findings: </strong>{l.investigation_summary.findings}</div>
                      <div><strong>Action Taken: </strong>{l.investigation_summary.action_taken}</div>
                    </Box>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};
