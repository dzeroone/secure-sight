"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import RecommendationNotes from "../RecommendationNotes";
import { CHART_EXTRAS } from "@@/constants";

const EmailQuarantineSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.email_quarantine_summary_cas
  );

  return (
    <div id={data.id}>
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
        }}
      >
        Email Quarantine <br />
        Summary from CAS
      </p>
      <div
        style={{
          width: "60%",
          height: Math.min(
            CHART_EXTRAS.LEGEND_HEIGHT +
              data.status_chart.key.length * CHART_EXTRAS.HEIGHT_PER_KEY,
            1000
          ),
          margin: "auto",
        }}
      >
        <BarChartHorizontal data={data.status_chart} />
      </div>
      <div style={{ marginTop: 40 }}>
        <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
          Top Sender and Receipts
        </p>
      </div>
      <div style={{ marginTop: 40 }}>
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
              <th>Top Sender</th>
              <th>Top Receipts</th>
            </tr>
          </thead>
          <tbody>
            <tr
              style={{
                fontSize: 20,
                textAlign: "start",
              }}
            >
              <td width={500}>
                <p style={{ margin: 0, lineHeight: 1.3 }}>
                  {data.sender_receipts.sender}
                </p>
              </td>
              <td width={500}>
                <p style={{ margin: 0, lineHeight: 1.3 }}>
                  {data.sender_receipts.receipt}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div style={{ marginTop: 40 }}>
        <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
          Threat Type
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
              <th>Malicious Files</th>
              <th>Malicious URLs</th>
              <th>Phishing</th>
              <th>Spoofing</th>
              <th>Suspicious Object</th>
              <th>Blocked Object</th>
            </tr>
          </thead>
          <tbody>
            <tr
              style={{
                fontSize: 20,
              }}
            >
              <td>{data.threat_type.malicious_files}</td>
              <td>{data.threat_type.malicious_urls}</td>
              <td>{data.threat_type.phishing}</td>
              <td>{data.threat_type.spoofing}</td>
              <td>{data.threat_type.suspicious_objects}</td>
              <td>{data.threat_type.blocked_objects}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default EmailQuarantineSummary;
