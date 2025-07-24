import PropTypes from "prop-types";
import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  CardBody,
  Col,
  Container,
  Row
} from "reactstrap";
import eventusLogoHorizontal from "../../assets/images/eventus_logo_vertical.png";
import withRouter from "../../components/Common/withRouter";
import { getMSALApplication } from "../../helpers/azure_sso.helper";
import { getErrorMessage, setDocumentTitle } from "../../helpers/utils";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import { WindowsIcon } from "../../components/icons";

const LoginSSO = (props) => {
  setDocumentTitle("Login")

  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const handleAzureRedirecPromise = useCallback(async () => {
    try {
      setBusy(true)
      const msalApplication = await getMSALApplication()
      const response = await msalApplication.handleRedirectPromise()
      if (response) {
        const data = await ApiServices(
          'post',
          {
            token: response.account.idToken
          },
          ApiEndPoints.AzureAD
        )
        localStorage.setItem('authUser', JSON.stringify(data))
        navigate('/dashboard', {
          replace: true
        })
      }
    } catch (e) {
      console.error(e)
      const msg = getErrorMessage(e)
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }, [])

  const onClickSignIn = async () => {
    try {
      setBusy(true)
      const msalApplication = await getMSALApplication()
      await msalApplication.loginRedirect({
        prompt: 'select_account'
      })
    } catch (e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    } finally {
      setBusy(false)
    }
  }

  useEffect(() => {
    handleAzureRedirecPromise()
  }, [handleAzureRedirecPromise])

  return (
    <React.Fragment>
      <div className="account-pages py-5">
        <Container>
          <Row className="justify-content-between align-items-center">
            <Col lg={6}>
              <div className="text-center">
                <img src={eventusLogoHorizontal} alt="eventus" width='150px' className="mb-4" />
              </div>
              <h1
                className="h1"
                style={{
                  color: "#f0f0f0",
                  textAlign: "center",
                  marginBottom: "2rem",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0. 6)",
                }}
              >
                Custom Reports for Trend Micro
              </h1>
              <p
                style={{
                  color: "#f0f0f0",
                  fontSize: "1.1rem",
                  textAlign: "justify",
                  marginBottom: "1.2rem",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                }}
              >
                The Trend Micro SOC Automated Reporting Tool is an advanced solution designed to automate the generation, encryption, and distribution of security reports. It seamlessly integrates with SOAR (Security Orchestration, Automation, and Response) platforms and Trend Micro Vision One to pull critical security data, including alerts, incidents, and threat intelligence. The tool then aggregates, normalizes, and analyzes this data to generate comprehensive weekly and monthly reports that provide valuable insights into the security landscape.
              </p>
              <p style={{
                fontSize: "1.1rem",
                textAlign: "justify",
                marginBottom: "1.2rem",
              }}>
                The Trend Micro SOC Automated Reporting Tool boosts security, compliance, and operational efficiency by automating reporting and incorporating strong encryption features. It helps SOC teams reduce manual work, allowing them to concentrate on more valuable tasks, making it an essential tool for handling large amounts of sensitive data.
              </p>
              {/* <div className="text-center">
                <img
                  src="https://png.pngtree.com/thumb_back/fw800/background/20230928/pngtree-dark-background-showcasing-3d-safety-security-logo-and-ample-copy-space-image_13513928.png"
                  alt="Logo"
                  className="auth-logo mx-auto"
                  style={{
                    maxWidth: "90%",
                    height: "auto",
                  }}
                />
              </div> */}
            </Col>
            <Col lg={6} md={8} xl={5}>
              <div
                className="p-4"
                style={{
                  backgroundColor: "#f9f9f9", // A lighter gray instead of pure white
                  borderRadius: "10px",
                  boxShadow: "0 8px 16px rgba(0, 0, 0, 0.1)",
                  height: "auto",
                  padding: "40px",
                }}
              >
                <h1
                  className="mb-4"
                  style={{
                    color: "#333",
                    fontWeight: "700",
                    fontSize: "32px",
                    textAlign: "left",
                  }}
                >
                  Welcome
                </h1>
                <p
                  className="mb-5"
                  style={{
                    color: "#777",
                    fontSize: "16px",
                    textAlign: "left",
                  }}
                >
                  Log in to access your account
                </p>
                <CardBody style={{ paddingTop: "0" }}>
                  <Button
                    size="lg"
                    onClick={onClickSignIn}
                    disabled={busy}
                    color="primary"
                  >
                    <WindowsIcon /> Log in with Azure AD
                  </Button>
                </CardBody>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default withRouter(LoginSSO);

LoginSSO.propTypes = {
  router: PropTypes.object.isRequired,
};