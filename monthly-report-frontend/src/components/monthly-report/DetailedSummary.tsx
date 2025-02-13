"use client";
import { useAppSelector } from "@@/lib/hooks";
import DoughnutChart from "../charts/DoughnutChart";

const DetailedSummary = () => {
  const data = useAppSelector((state) => state.monthlyReport.detailed_summary);

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
          Detailed Summary
        </p>
        <p style={{ fontSize: 24, color: "#000" }}>
          A total number of <strong>{data.no_of_incidents}</strong> were
          observed during the month of <strong>{data.date}</strong>.
        </p>
      </div>
      {data.risk_index_chart.datasets[0].data[0] != 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(6, 1fr)",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div style={{ gridColumn: "span 2" }}>
            <p
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#090c9b",
                marginBottom: 0,
              }}
            >
              Risk Index
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
              <div
                style={{
                  position: "relative",
                  width: 200,
                  height: 200,
                  marginTop: 20,
                }}
              >
                {/* <canvas id="riskIndex" /> */}
                <DoughnutChart data={data.risk_index_chart} />
              </div>
              <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
                {data.risk_index_chart.datasets[0].data[0]}/100
              </p>
            </div>
          </div>
          <div style={{ gridColumn: "span 4" }}>
            <p style={{ fontSize: 20, fontStyle: "italic", marginTop: 60 }}>
              {data.risk_index_text}
            </p>
          </div>
        </div>
      )}
      <div style={{ marginTop: 20 }}>
        <ul style={{ listStyleType: "disc", paddingLeft: 20 }}>
          <li style={{ fontSize: 24, marginBottom: "1rem" }}>
            <strong>
              {data.highly_exploitable} Highly exploitable unique CVEs
            </strong>{" "}
            noted in Endpoints.
          </li>
          <li style={{ fontSize: 24, marginBottom: "1rem" }}>
            <strong>{data.incidents_closed} Incident</strong> Closed without
            customer resolution.
          </li>
        </ul>
      </div>
      <div>
        {data.top_incidents.length > 0 && (
          <div>
            <div>
              <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
                Top {data.top_incidents.length} Incidents
              </p>
            </div>
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
                  <th>Incident Names with no of Occurrence</th>
                  <th>Priority - Impact</th>
                  <th>Data Source</th>
                </tr>
              </thead>
              <tbody>
                {data.top_incidents.map((i, j) => (
                  <tr
                    style={{
                      fontSize: 20,
                      backgroundColor: j % 2 === 0 ? "#ededed" : "transparent",
                    }}
                    key={j}
                  >
                    <td style={{ textAlign: "left" }}>{i.incident_name}</td>
                    <td>{i.priority_impact}</td>
                    <td>{i.data_source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {data.license_consumption && (
          <div>
            <p
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#090c9b",
                marginBottom: 0,
              }}
            >
              License Consumption :
            </p>
            <p style={{ fontSize: 24, color: "#090c9b" }}>
              {data.license_consumption_text}
            </p>
          </div>
        )}
        {data.data_consumption && (
          <div>
            <p
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#090c9b",
                marginBottom: 0,
              }}
            >
              Data Consumption :
            </p>
            <p style={{ fontSize: 24, color: "#090c9b" }}>
              {data.data_consumption_text}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailedSummary;
