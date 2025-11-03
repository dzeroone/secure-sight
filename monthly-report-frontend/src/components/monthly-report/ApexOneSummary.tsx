"use client";

import { useAppSelector } from "@@/lib/hooks";
import BarChartHorizontal from "../charts/BarChartHorizontal";
import { CHART_EXTRAS } from "@@/constants";

const ApexOneSummary = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.detection_summary_apex_one
  );
  return (
    <>
      <div id={data.id}>
        <p
          style={{
            marginTop: 40,
            fontSize: "4.2rem",
            fontWeight: 700,
            color: "#090c9b",
          }}
        >
          Detection Summary from Apex One as a Service / Std Endpoint Protection
        </p>
        <div>
          <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
            Virus / Malware and Spyware / Grayware
          </p>
          <div
            style={{
              width: "60%",
              height: Math.min(
                CHART_EXTRAS.LEGEND_HEIGHT +
                  data.detection_chart.key.length * CHART_EXTRAS.HEIGHT_PER_KEY,
                1000
              ),
              margin: "auto",
            }}
          >
            <BarChartHorizontal data={data.detection_chart} />
          </div>
        </div>
        <div>
          <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
            C &amp; C Connections and Intrusion attempts Blocked
          </p>
          <div
            style={{
              width: "60%",
              height: Math.min(
                CHART_EXTRAS.LEGEND_HEIGHT +
                  data.attempts_blocked_chart.key.length *
                    CHART_EXTRAS.HEIGHT_PER_KEY,
                1000
              ),
              margin: "auto",
            }}
          >
            {/* <canvas style={{ marginTop: 10 }} id="horizontalBarCharts5" /> */}
            <BarChartHorizontal data={data.attempts_blocked_chart} />
          </div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 40,
          gap: 20,
        }}
      >
        {data.tables.table1.length > 0 && (
          <div style={{ marginTop: 24, paddingBottom: 50 }}>
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
                  <th>Top Endpoints File Cleaned</th>
                  <th>Top Endpoints File Quarantined</th>
                  <th>Top Endpoints File Deleted</th>
                </tr>
              </thead>
              <tbody>
                {data.tables.table1.map((i, j) => (
                  <tr
                    style={{
                      fontSize: 20,
                      backgroundColor: j % 2 === 0 ? "#ededed" : "#ffffff",
                    }}
                    key={j}
                  >
                    <td>{i.file_cleaned} ({i.fc_v || 0})</td>
                    <td>{i.file_quarantined} ({i.fq_v || 0})</td>
                    <td>{i.file_deleted} ({i.fd_v || 0})</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div style={{ width: "100%", height: "100%" }}>
          {data.tables.table2.length > 0 && (
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
                  <th>
                    Top Endpoints Intrusion <br />
                    Attempts Blocked
                  </th>
                  <th>Top Endpoints C &amp; C Connection Blocked</th>
                </tr>
              </thead>
              <tbody>
                {data.tables.table2.map((k, l) => (
                  <tr
                    style={{
                      fontSize: 20,
                      backgroundColor: l % 2 === 0 ? "#ededed" : "#ffffff",
                    }}
                    key={l}
                  >
                    <td>
                      {k.attempts_blocked?.endpoint} ({k.attempts_blocked?.blocked})
                    </td>
                    <td>
                      {k.connection_endpoint?.endpoint} ({k.connection_endpoint?.blocked})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
      {/* <div>
        <p style={{ color: "#090c9b", fontWeight: "bold" }}>
          ##Inacse of large number of detections from the same virus/malware
          include Virus name, Detected during which scan, Action taken by a1
          agent, User, File, Path, OS.##
        </p>
        <ul>
          <li style={{ color: "#090c9b", fontWeight: "bold" }}>
            Eg: Possible_SMPARROTTDSAYXCHEZ virus/malware was detected 1 time on
            CLP-5CG7233MVY endpoint during Schedule scan and the File is
            Quarantined by Apex one
          </li>
          <li style={{ color: "#090c9b", fontWeight: "bold" }}>
            User : CLIX\101198
          </li>
          <li style={{ color: "#090c9b", fontWeight: "bold" }}>
            File : f_000c56
          </li>
          <li style={{ color: "#090c9b", fontWeight: "bold" }}>
            File Path :
            C:\Users\101198\AppData\Local\Google\Chrome\UserData\Default\Cache\Cache_Data\
          </li>
          <li style={{ color: "#090c9b", fontWeight: "bold" }}>
            Operating System : Windows 10
          </li>
        </ul>
        <p style={{ color: "#090c9b", fontWeight: "bold" }}>
          ##Incase if all C&amp;C connections are passed, highlight the same so
          that the policy is fine-tuned accordingly##
        </p>
      </div> */}
    </>
  );
};

export default ApexOneSummary;
