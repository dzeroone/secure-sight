import React from "react";
import {
  Row,
  Col,
  CardBody,
  Card,
  Container,
  Input,
  Label,
  Form,
  FormFeedback,
} from "reactstrap";
import * as Yup from "yup";
import { useFormik } from "formik";
import { Link } from "react-router-dom";
import axios from "axios";
import ApiEndPoints from '../../Network_call/ApiEndPoints'

const Register = (props) => {
  document.title = "Sign Up | Upzet - React Admin & Dashboard Template";

  // Formik Validation
  const validation = useFormik({
    initialValues: {
      email: "",
      username: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Please Enter Your Email"),
      username: Yup.string().required("Please Enter Your Username"),
      password: Yup.string().required("Please Enter Your Password"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await axios.post(
          ApiEndPoints.Register,
          values
        );
        // Handle success (optional)
      } catch (error) {
        // Handle error (optional)
      }
    },
  });

  return (
    <div
      className="bg-pattern"
      style={{ height: "100vh", backgroundColor: "#000", paddingTop: "15vh" }}
    >
      <style>
        {`
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box !important;
          }

          html, body {
            height: 100%;
          }

          body {
            display: table;
            width: 100%;
            height: 100%;
            background-color: #171717;
            color: #000;
            line-height: 1.6;
            position: relative;
            font-family: sans-serif;
            overflow: hidden;
          }

          .lines {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            margin: auto;
            width: 90vw;
          }

          .line {
            position: absolute;
            width: 3px; /* Increased width for larger lines */
            height: 100%;
            top: 0;
            left: 50%;
            background: rgba(255, 255, 255, 0.3); /* Brighter line color */
            overflow: hidden;
          }

          .line::after {
            content: '';
            display: block;
            position: absolute;
            height: 15vh;
            width: 100%;
            top: -50%;
            left: 0;
            background: linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.8) 75%, rgba(255, 255, 255, 0.8) 100%); /* Brighter gradient */
            animation: drop 7s 0s infinite;
            animation-fill-mode: forwards;
            animation-timing-function: cubic-bezier(0.4, 0.26, 0, 0.97);
          }

          .line:nth-child(1) {
            margin-left: -25%;
          }

          .line:nth-child(1)::after {
            animation-delay: 2s;
          }

          .line:nth-child(3) {
            margin-left: 25%;
          }

          .line:nth-child(3)::after {
            animation-delay: 2.5s;
          }

          @keyframes drop {
            0% {
              top: -50%;
            }
            100% {
              top: 110%;
            }
          }
        `}
      </style>
      <div className="lines">
        {" "}
        {/* Add lines div here */}
        <div className="line"></div>
        <div className="line"></div>
        <div className="line"></div>
      </div>
      <div className="bg-overlay"></div>
      <div className="account-pages pt-16">
        <Container className="h-100">
          <Row className="justify-content-center align-items-center h-100">
            <Col lg={6} md={8} xl={5} className="mb-4">
              <Card
                className="p-4"
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "15px",
                  boxShadow: "0 4 px 20px rgba(0, 0, 0, 0.1)",
                }}
              >
                <CardBody
                  className="d-flex flex-column justify-content-center"
                  style={{ height: "100%" }}
                >
                  <h4
                    className="font-size-24 text-black text-start mt-0 mb-4"
                    style={{ fontWeight: "600" }}
                  >
                    Sign Up
                  </h4>
                  <Form
                    className="form-horizontal flex-grow-1"
                    onSubmit={validation.handleSubmit}
                  >
                    <Row>
                      <Col md={12}>
                        <div className="mb-4">
                          <Label className="form-label text-black">Email</Label>
                          <Input
                            id="email"
                            name="email"
                            className="form-control"
                            placeholder="Enter email"
                            type="email"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.email || ""}
                            invalid={
                              validation.touched.email &&
                              validation.errors.email
                                ? true
                                : false
                            }
                            style={{
                              backgroundColor: "#f4f4f4",
                              border: "2px solid #ddd",
                              color: "#444",
                              height: "50px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow effect
                              transition: "all 0.3s ease", // Add transition for smooth hover effect
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)"}
                            onMouseLeave={(e) => e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"}
                          />
                          {validation.touched.email &&
                          validation.errors.email ? (
                            <FormFeedback type="invalid">
                              {validation.errors.email}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-4">
                          <Label className="form-label text-black">
                            Username
                          </Label>
                          <Input
                            name="username"
                            type="text"
                            placeholder="Enter username"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.username || ""}
                            invalid={
                              validation.touched.username &&
                              validation.errors.username
                                ? true
                                : false
                            }
                            style={{
                              backgroundColor: "#f4f4f4",
                              border: "2px solid #ddd",
                              color: "#444",
                              height: "50px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow effect
                              transition: "all 0.3s ease", // Add transition for smooth hover effect
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)"}
                            onMouseLeave={(e) => e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"}
                          />
                          {validation.touched.username &&
                          validation.errors.username ? (
                            <FormFeedback type="invalid">
                              {validation.errors.username}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="mb-4">
                          <Label className="form-label text-black">
                            Password
                          </Label>
                          <Input
                            name="password"
                            type="password"
                            placeholder="Enter Password"
                            onChange={validation.handleChange}
                            onBlur={validation.handleBlur}
                            value={validation.values.password || ""}
                            invalid={
                              validation.touched.password &&
                              validation.errors.password
                                ? true
                                : false
                            }
                            style={{
                              backgroundColor: "#f4f4f4",
                              border: "2px solid #ddd",
                              color: "#444",
                              height: "50px",
                              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)", // Add shadow effect
                              transition: "all 0.3s ease", // Add transition for smooth hover effect
                            }}
                            onMouseEnter={(e) => e.target.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)"}
                            onMouseLeave={(e) => e.target.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)"}
                          />
                          {validation.touched.password &&
                          validation.errors.password ? (
                            <FormFeedback type="invalid">
                              {validation.errors.password}
                            </FormFeedback>
                          ) : null}
                        </div>
                        <div className="d-grid mt-4">
                          <button
                            className="btn"
                            style={{
                              backgroundColor: "#27294F",
                              color: "white",
                              fontWeight: "bold",
                            }}
                            type="submit"
                          >
                            Sign Up
                          </button>
                        </div>
                        <div className="mt-4 text-center">
                          <p className="text-muted">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#27294F]">
                              Login
                            </Link>
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
            <Col
              lg={6}
              className="text-center d-flex flex-column justify-content-center align-items-start"
              style={{ paddingLeft: "180px" }}
            >
              <h2
                style={{
                  color: "#f0f0f0",
                  fontWeight: "bold",
                  fontSize: "40px",
                  textAlign: "left",
                  marginBottom: "30px",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                }}
              >
                Custom Reports for CloudOne/Deep Security <br /> All in One
              </h2>
              <h2
                style={{
                  color: "#f0f0f0",
                  fontWeight: "bold",
                  fontSize: "20px",
                  textAlign: "left",
                  marginBottom: "70px",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.6)",
                }}
              >
                Unlock insights with tailored reports for CloudOne and Deep
                Security. Streamline security and make informed decisions.
              </h2>
              {/* <div>
                <img
                  src="https://png.pngtree.com/thumb_back/fw800/background/20230928/pngtree-dark-background-showcasing-3d-safety-security-logo-and-ample-copy-space-image_13513928.png"
 alt="Logo"
                  className="auth-logo"
                  style={{
                    maxWidth: "90%",
                    height: "auto",
                  }}
                />
              </div> */}
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default Register;
