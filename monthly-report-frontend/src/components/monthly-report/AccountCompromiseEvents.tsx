"use client";

import { useAppSelector } from "@@/lib/hooks";

const AccountCompromiseEvents = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.account_compromise_events
  );

  return (
    <div style={{ marginTop: 40 }} id="account_compromise_report">
      <div>
        <p
          style={{
            fontSize: "4.2rem",
            fontWeight: 700,
            color: "#090c9b",
            marginBottom: 0,
          }}
        >
          Account Compromise Events
        </p>
        {data.risk_event_table.length > 0 && (
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
                <th>Risk Event</th>
                <th>Data Source</th>
                <th style={{ whiteSpace: "nowrap" }}>Asset</th>
                <th>Event Risk</th>
              </tr>
            </thead>
            <tbody style={{ textAlign: "start" }}>
              {data.risk_event_table.map((item, i) => (
                <tr
                  style={{
                    fontSize: 20,
                    backgroundColor: i % 2 === 0 ? "#ededed" : "#ffffff",
                  }}
                  key={i}
                >
                  <td>{item.risk_event}</td>
                  <td style={{ textAlign: "start" }}>{item.data_source}</td>
                  <td>{item.asset}</td>
                  <td>{item.event_risk}</td>
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
        <ul>
          {data.rsn.data.map((j, k) => (
            <li style={{ fontSize: 24 }} key={k}>
              {j}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AccountCompromiseEvents;
