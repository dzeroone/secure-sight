"use client";
import { useAppSelector } from "@@/lib/hooks";
import RecommendationNotes from "../RecommendationNotes";

const SystemConfigurationReport = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.system_configuration_report
  );
  return (
    <div style={{ marginTop: 40 }} id={data.id}>
      <p
        style={{
          marginTop: 40,
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
        }}
      >
        System Configuration Report
      </p>
      <div style={{ margin: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ backgroundColor: "#090c9b", color: "white" }}>
              <th
                // colSpan={2}
                style={{ padding: 24, width: "40%" }}
              ></th>
              <th style={{ padding: 24 }}></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td
                style={{
                  backgroundColor: "#d9e2f1",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  color: "#090c9b",
                  fontWeight: "bold",
                }}
              >
                ACCOUNTS WITH WEAK AUTHENTICATION
              </td>
              <td
                style={{
                  backgroundColor: "#f4f6fb",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {data.accounts_with_weak_auth}
                <br />
                <span style={{ fontWeight: "normal" }}>
                  of your Account have weak authentication.
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  backgroundColor: "#d9e2f1",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  color: "#090c9b",
                  fontWeight: "bold",
                }}
              >
                ACCOUNTS THAT INCREASE ATTACK SURFACE RISK
              </td>
              <td
                style={{
                  backgroundColor: "#f4f6fb",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {data.account_attack_surface_risk}
                <br />
                <span style={{ fontWeight: "normal" }}>
                  of your accounts increases the attack surface risk
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  backgroundColor: "#d9e2f1",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  color: "#090c9b",
                  fontWeight: "bold",
                }}
              >
                ACCOUNTS WITH EXCESSIVE PRIVILEGE
              </td>
              <td
                style={{
                  backgroundColor: "#f4f6fb",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {data.accounts_with_excessive_privilege}
                <br />
                <span style={{ fontWeight: "normal" }}>
                  of your accounts have excessive privilege
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  backgroundColor: "#d9e2f1",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  color: "#090c9b",
                  fontWeight: "bold",
                }}
              >
                LEGACY AUTHENTICATION PROTOCOL WITH LOG ON ACTIVITY
              </td>
              <td
                style={{
                  backgroundColor: "#f4f6fb",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {data.legacy_auth_logon_activity}
                <br />
                <span style={{ fontWeight: "normal" }}>
                  Log on activity from legacy authentication protocols
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  backgroundColor: "#d9e2f1",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  color: "#090c9b",
                  fontWeight: "bold",
                }}
                rowSpan={2}
              >
                UNEXPECTED INTERNET-FACING SERVICES/PORTS
              </td>
              <td
                style={{
                  backgroundColor: "#f4f6fb",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {data.unexpected_internet_facing_serve_port.service_port}
                <br />
                <span style={{ fontWeight: "normal" }}>
                  Unique unexpected services/ports
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  backgroundColor: "#f4f6fb",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {data.unexpected_internet_facing_serve_port.affected_ip}
                <br />
                <span style={{ fontWeight: "normal" }}>
                  Total public IPs affected
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  backgroundColor: "#d9e2f1",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  color: "#090c9b",
                  fontWeight: "bold",
                }}
                rowSpan={2}
              >
                HOSTS WITH INSECURE CONNECTION ISSUES
              </td>
              <td
                style={{
                  backgroundColor: "#f4f6fb",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {data.host_with_insecure_connection.insecure_connection}
                <br />
                <span style={{ fontWeight: "normal" }}>
                  Hosts with insecure connection issues
                </span>
              </td>
            </tr>
            <tr>
              <td
                style={{
                  backgroundColor: "#f4f6fb",
                  borderBottom: "1px solid #090c9b",
                  padding: 16,
                  fontSize: 20,
                  fontWeight: "bold",
                }}
              >
                {data.host_with_insecure_connection.total}
                <br />
                <span style={{ fontWeight: "normal" }}>
                  Hosts with insecure connection issues
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <RecommendationNotes notes={data.notes} />
    </div>
  );
};

export default SystemConfigurationReport;
