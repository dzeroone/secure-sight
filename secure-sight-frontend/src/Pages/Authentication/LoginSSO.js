import PropTypes from "prop-types";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Button,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row
} from "reactstrap";
import eventusLogoHorizontal from "../../assets/images/eventus_logo_vertical.png";
import withRouter from "../../components/Common/withRouter";
import { getMSALApplication } from "../../helpers/azure_sso.helper";
import { getErrorMessage, setDocumentTitle } from "../../helpers/utils";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import { WindowsIcon } from "../../components/icons";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as Yup from "yup";
import Divider from "../../components/Divider";
import { LogInIcon } from "lucide-react";
import { loginSuccess, loginUser } from "../../store/actions";
import { CSSTransition, SwitchTransition } from "react-transition-group";

const LoginSSO = (props) => {
  setDocumentTitle("Login")

  const navigate = useNavigate()

  const dispatch = useDispatch();

  const validation = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Please Enter Your Email").required("Please Enter Your Email"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: (values) => {
      dispatch(loginUser(values, props.router.navigate));
    },
  });

  const passwordResetForm = useFormik({
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Please Enter Your Email").required("Please Enter Your Email"),
    }),
    onSubmit: async (values) => {
      try {
        const data = await ApiServices(
          'post',
          {
            email: values.email
          },
          ApiEndPoints.AuthForgot
        )
        toast.success("Password reset request has been sent to administrator. You will be contacted soon.")
      }catch(e) {
        const msg = getErrorMessage(e)
        toast.error(msg)
      }
    },
  });

  const { error } = useSelector((state) => ({
    error: state.login.error,
  }));

  const formContainerRef = useRef(null)
  const [activeForm, setActiveForm] = useState('signin')

  const [busy, setBusy] = useState(false)

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
        dispatch(loginSuccess(data))
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
                  color: '#000',
                  overflow: 'hidden'
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
                <SwitchTransition>
                  <CSSTransition
                    key={activeForm}
                    nodeRef={formContainerRef}
                    addEndListener={(done) => {
                      formContainerRef.current.addEventListener("transitionend", done, false);
                    }}
                    classNames="fade"
                  >
                    <div ref={formContainerRef}>
                      {activeForm == 'signin' ? (
                        <div>
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
                          <div style={{ paddingTop: "0" }}>
                            <Form
                              className="form-horizontal"
                              onSubmit={(e) => {
                                e.preventDefault();
                                validation.handleSubmit();
                                return false;
                              }}
                            >
                              {error ? (
                                <div className="alert alert-danger">
                                  <div>{error}</div>
                                </div>
                              ) : null}
                              <div className="d-flex flex-column gap-2">
                                <div>
                                  <Label className="form-label" style={{ color: "#444" }}>
                                    Email
                                  </Label>
                                  <Input
                                    name="email"
                                    className="elevated-input"
                                    placeholder="Enter your email"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.email || ""}
                                    invalid={
                                      validation.touched.email && validation.errors.email
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.email && validation.errors.email ? (
                                    <FormFeedback type="invalid">
                                      <div>{validation.errors.email}</div>
                                    </FormFeedback>
                                  ) : null}
                                </div>
                                <div>
                                  <Label className="form-label" style={{ color: "#444" }}>
                                    Password
                                  </Label>
                                  <Input
                                    className="elevated-input"
                                    name="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    onChange={validation.handleChange}
                                    onBlur={validation.handleBlur}
                                    value={validation.values.password || ""}
                                    invalid={
                                      validation.touched.password && validation.errors.password
                                        ? true
                                        : false
                                    }
                                  />
                                  {validation.touched.password && validation.errors.password ? (
                                    <FormFeedback type="invalid">
                                      <div>{validation.errors.password}</div>
                                    </FormFeedback>
                                  ) : null}
                                </div>
                                <div className="d-flex flex-row justify-content-between align-items-end">
                                  <button
                                    className="btn btn-lg btn-primary"
                                    type="submit"
                                  >
                                    Log In <LogInIcon />
                                  </button>
                                  <div className="text-md-end mt-3 mt-md-0">
                                    <button
                                      type="button"
                                      className="btn btn-link"
                                      onClick={() => {
                                        setActiveForm('forgot')
                                      }}
                                    >
                                      Forgot your password?
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </Form>
                            <Divider className="my-4 text-muted">OR</Divider>
                            <Button
                              size="lg"
                              onClick={onClickSignIn}
                              disabled={busy}
                              color="primary"
                            >
                              <WindowsIcon /> Log in with Azure AD
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div>
                            <p
                              className="mb-5"
                              style={{
                                color: "#777",
                                fontSize: "16px",
                                textAlign: "left",
                              }}
                            >
                              Password reset
                            </p>
                            <div style={{ paddingTop: "0" }}>
                              <Form
                                className="form-horizontal"
                                onSubmit={(e) => {
                                  e.preventDefault();
                                  passwordResetForm.handleSubmit();
                                  return false;
                                }}
                              >
                                <div className="d-flex flex-column gap-2">
                                  <div>
                                    <Label className="form-label" style={{ color: "#444" }}>
                                      Email
                                    </Label>
                                    <Input
                                      className="elevated-input"
                                      name="email"
                                      placeholder="example@email.net"
                                      onChange={passwordResetForm.handleChange}
                                      onBlur={passwordResetForm.handleBlur}
                                      value={passwordResetForm.values.email || ""}
                                      invalid={
                                        passwordResetForm.touched.email && passwordResetForm.errors.email
                                          ? true
                                          : false
                                      }
                                    />
                                    {passwordResetForm.touched.email && passwordResetForm.errors.email ? (
                                      <FormFeedback type="invalid">
                                        <div>{passwordResetForm.errors.email}</div>
                                      </FormFeedback>
                                    ) : null}
                                  </div>
                                  <div className="d-flex flex-row justify-content-between align-items-end">
                                    <button
                                      className="btn btn-lg btn-primary"
                                      type="submit"
                                    >
                                      Send
                                    </button>
                                    <div className="text-md-end mt-3 mt-md-0">
                                      <button
                                        type="button"
                                        className="btn btn-link"
                                        onClick={() => {
                                          setActiveForm('signin')
                                        }}
                                      >
                                        Sign in to your account
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </Form>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CSSTransition>
                </SwitchTransition>
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