"use client";

import { useAppSelector } from "@@/lib/hooks";
import VerticalBarChart from "../charts/VerticalBarChart";

const AboutReport = () => {
  const data = useAppSelector((state) => state.monthlyReport.about_this_report);
  return (
    <div style={{ boxSizing: "border-box" }} id="about_this_report">
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
          About this report
        </p>
        <p style={{ fontSize: 24, color: "#000" }}>
          This report summarizes the topics that are particularly important
          among various information, security incidents and events that occurred
          during{" "}
          <span style={{ fontWeight: "bold", fontSize: 24 }}>{data.date}</span>{" "}
          and the changes in the environment surrounding them.
        </p>
      </div>
      <div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 30,
          }}
        >
          {data.data?.map((item, i) => (
            <div style={{ gridColumn: "span 1" }} key={i}>
              <p
                style={{
                  color: "#090c9b",
                  fontSize: "1.8rem",
                  fontWeight: 600,
                  marginBottom: 0,
                }}
              >
                {item.title}
              </p>
              <p style={{ fontSize: 24, color: "#000", textAlign: "justify" }}>
                {item.desc}
              </p>
              {item.sub?.map((j, k) => (
                <div key={k}>
                  <p
                    style={{ fontSize: 26, color: "#4d51da", marginBottom: 0 }}
                  >
                    {k + 1}. {j.title}
                  </p>
                  <p style={{ fontSize: 24, textAlign: "justify" }}>{j.desc}</p>
                </div>
              ))}
            </div>
          ))}
          <div
            style={{ gridColumn: "span 1", width: "400px", height: "400px" }}
          >
            <VerticalBarChart data={data.chart} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutReport;
