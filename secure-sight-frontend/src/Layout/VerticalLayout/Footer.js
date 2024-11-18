import React from "react";

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: "#0E0F1B",
      padding: "20px 0",
      width: "100%",
      marginLeft:"7rem",
      borderTop: "1px solid rgba(56, 189, 248, 0.1)",
      marginTop: "auto"
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 20px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        color: "#94a3b8"
      }}>
        <div>
          <div style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "#38bdf8",
            marginBottom: "8px"
          }}>
            SecureSight
          </div>
          <div style={{ fontSize: "14px" }}>
            © {new Date().getFullYear()} All rights reserved
          </div>
        </div>

        <div style={{
          display: "flex",
          gap: "48px"
        }}>
          <div>
            <h5 style={{
              color: "#f1f5f9",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              marginBottom: "12px"
            }}>
              Company
            </h5>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>About</a>
              <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Services</a>
              <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Contact</a>
            </div>
          </div>

          <div>
            <h5 style={{
              color: "#f1f5f9",
              fontSize: "14px",
              fontWeight: "600",
              textTransform: "uppercase",
              marginBottom: "12px"
            }}>
              Support
            </h5>
            <div style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Help Center</a>
              <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Documentation</a>
              <a href="#" style={{ color: "#94a3b8", textDecoration: "none", fontSize: "14px" }}>Status</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;