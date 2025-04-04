"use client";
import { useAppSelector } from "@@/lib/hooks";
import DoughnutChart from "../charts/DoughnutChart";
import GaugeChart from "../charts/GaugeChart";
import { RiskIndicatorType } from "@@/types/types";

const RiskMetrics = () => {
  const data = useAppSelector((state) => state.monthlyReport.risk_metrics);

  return (
    <div id="risk_metrics">
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
          marginBottom: 0,
        }}
      >
        Risk Metrics
      </p>
      <p style={{ fontSize: 24, color: "#000" }}>
        Provide security risk metrics that give an at-a-glance view of the
        security landscape of the <strong>{data.date}</strong>.
      </p>
      <div>
        <p
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: "#090c9b",
            marginBottom: 0,
          }}
        >
          Last {data.last_risk_score.no_of_months} months risk score
        </p>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 140,
            marginTop: 20,
          }}
        >
          {data.last_risk_score?.charts?.map((chart, i) => (
            <div key={i}>
              {chart.datasets[0].data[0] > 0 && (
                <div
                  style={{
                    position: "relative",
                    width: 200,
                    height: 200,
                    marginTop: 20,
                  }}
                >
                  {chart?.datasets && <DoughnutChart data={chart} />}
                  <p
                    style={{
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      fontSize: 22,
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {chart.month}
                  </p>
                  <p
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -15,
                      fontSize: 22,
                      fontWeight: "bold",
                      margin: 0,
                    }}
                  >
                    {chart.datasets[0].data[0]}%
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
        {data.top_risk_incidents.visible && (
          <>
            <p
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#090c9b",
                marginTop: 40,
                marginBottom: 40,
              }}
            >
              Top Risk Vectors based on Incidents detected
            </p>
            <div
              style={{ display: "flex", justifyContent: "center", gap: 140 }}
            >
              {data.top_risk_incidents?.indicators?.map((indicator, i) => (
                <div key={i}>
                  {indicator.risk_name && (
                    <GaugeChart indicator={indicator as RiskIndicatorType} />
                  )}
                </div>
              ))}
            </div>
          </>
        )}
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
    </div>
  );
};

export default RiskMetrics;
