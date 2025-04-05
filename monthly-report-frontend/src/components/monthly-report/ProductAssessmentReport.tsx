"use client";

import { useAppSelector } from "@@/lib/hooks";

const ProductAssessmentReport = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.product_assessment_report
  );
  return (
    <div style={{ marginTop: 40 }} id={data.id}>
      <p
        style={{
          fontSize: "4.2rem",
          fontWeight: 700,
          color: "#090c9b",
          marginBottom: 0,
        }}
      >
        Product Assessment <br />
        Report
      </p>
      {data.tm_products_summary.length > 0 && (
        <div>
          <p style={{ fontSize: 26, fontWeight: "bold", color: "#090c9b" }}>
            Products Integrated
          </p>
          <div>
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
                  <th>TM Product</th>
                  <th>
                    Connection <br />
                    status
                  </th>
                  <th style={{ whiteSpace: "nowrap" }}>Identifier</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "start" }}>
                {data.tm_products_summary.map((i, j) => (
                  <tr
                    style={{
                      fontSize: 20,
                      backgroundColor: j % 2 === 0 ? "#ededed" : "#ffffff",
                    }}
                    key={j}
                  >
                    <td>{i.tm_product}</td>
                    <td style={{ textAlign: "start" }}>
                      {i.connection_status}
                    </td>
                    <td>{i.identifier}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {data.integration_summary.length > 0 && (
        <div>
          <p
            style={{
              fontSize: 26,
              fontWeight: "bold",
              color: "#090c9b",
              marginBottom: 0,
            }}
          >
            Third Party Products Integrated
          </p>
          <div>
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
                  <th>Product</th>
                  <th>Status</th>
                  <th>Product Quantity as per SOW</th>
                  <th>Integrated Devices / Log Receiving Status</th>
                  <th>Data Consumption</th>
                </tr>
              </thead>
              <tbody style={{ textAlign: "start" }}>
                {data.integration_summary.map((k, l) => (
                  <tr
                    style={{
                      fontSize: 20,
                      backgroundColor: l % 2 === 0 ? "#ededed" : "#ffffff",
                    }}
                    key={l}
                  >
                    <td style={{ whiteSpace: "nowrap" }}>{k.product}</td>
                    <td style={{ textAlign: "start" }}>{k.status}</td>
                    <td>{k.product_quantity_sow}</td>
                    <td>{k.id_log_status}</td>
                    <td>{k.data_consumption}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductAssessmentReport;
