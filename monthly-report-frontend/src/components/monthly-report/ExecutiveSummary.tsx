/* eslint-disable @next/next/no-img-element */
"use client";
import Incidents from "@@/assets/images/monthly-report/incidents.svg";
import Actions from "@@/assets/images/monthly-report/actions.svg";
import Recommendations from "@@/assets/images/monthly-report/recommendations.svg";
import Conclusion from "@@/assets/images/monthly-report/Conclusion.svg";
import { useAppSelector } from "@@/lib/hooks";

const ExecutiveSummary = () => {
  const data = useAppSelector((state) => state.monthlyReport.executive_summary);

  return (
    <>
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
          Executive Summary
        </p>
        <p style={{ fontSize: 24, color: "#000", textAlign: "justify" }}>
          This executive summary provides a condensed overview of the Managed
          Extended Detection and Response (MXDR) Security Operations Center as a
          Service (SOCaaS) activities and observations for the month of{" "}
          <span style={{ fontWeight: "bold", fontSize: 24 }}>{data.date}</span>.
          It offers insights into the key security incidents, response and
          recommendations for your organization&apos;s cybersecurity
          infrastructure.
        </p>
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(1, 1fr)",
          gap: 60,
        }}
      >
        <div
          style={{
            gridColumn: "span 1",
            textAlign: "justify",
            marginBottom: 0,
          }}
        >
          <div style={{ display: "flex", gap: 20 }}>
            <img style={{ width: 60 }} src={Incidents.src} alt="" />
            <h3 style={{ fontWeight: "bold", fontSize: 24 }}>
              {data.data[0].title}
            </h3>
          </div>
          {data.data[0].sub?.map((i, j) => (
            <p style={{ fontSize: 24 }} key={j}>
              {i.title && <strong>{i.title}:</strong>}
              {" " + i.desc}
            </p>
          ))}
          <div style={{ display: "flex", gap: 20 }}>
            <img style={{ width: 60 }} src={Actions.src} alt="" />
            <h3 style={{ fontWeight: "bold", fontSize: 24 }}>
              {data.data[1].title}
            </h3>
          </div>
          {data.data[1].sub?.map((k, l) => (
            <p style={{ fontSize: 24, wordBreak: "break-word" }} key={l}>
              {k.title && <strong>{k.title}:</strong>}
              {" " + k.desc}
            </p>
          ))}
        </div>
        <div style={{ gridColumn: "span 1", textAlign: "justify" }}>
          <div
            style={{
              gridColumn: "span 1",
              textAlign: "justify",
              marginBottom: 0,
            }}
          >
            <div style={{ display: "flex", gap: 20 }}>
              <img style={{ width: 60 }} src={Recommendations.src} alt="" />
              <h3 style={{ fontWeight: "bold", fontSize: 24 }}>
                {data.data[2].title}
              </h3>
            </div>
            {data.data[2].sub?.map((m, n) => (
              <p style={{ fontSize: 24, wordBreak: "break-word" }} key={n}>
                {m.title && <strong>{m.title}:</strong>} {" " + m.desc}
              </p>
            ))}
            <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
              <img
                style={{ width: 60, marginBottom: 0 }}
                src={Conclusion.src}
                alt=""
              />
              <h3 style={{ fontWeight: "bold", fontSize: 24 }}>
                {data.data[3].title}
              </h3>
            </div>
            <p style={{ fontSize: 24 }}>{data.data[3].desc}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ExecutiveSummary;
