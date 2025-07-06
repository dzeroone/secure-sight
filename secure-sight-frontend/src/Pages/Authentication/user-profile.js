import React, { useCallback, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row
} from "reactstrap";

// Formik Validation
import { useFormik } from "formik";
import * as Yup from "yup";

//redux

import withRouter from "../../components/Common/withRouter";

//Import Breadcrumb

import { toast } from "react-toastify";
import { useProfile } from "../../Hooks/UserHooks";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { ROLE_NAMES } from "../../data/app";
import { setProfileData } from "../../helpers/api_helper";
import { getErrorMessage } from "../../helpers/utils";
import ModalLoading from "../../components/ModalLoading";

const UserProfile = () => {
  const [ user, setUser ] = useState(null);
  const [busy, setBusy] = useState(false)
  const { userProfile } = useProfile()

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      fullname: "",
      email: "",
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Please Enter Your Full name"),
      email: Yup.string().email("Invalid email").required("Please Enter Your Email"),
    }),
    onSubmit: async (values) => {
      try {
        setBusy(true)
        await ApiServices(
          "patch",
          values,
          ApiEndPoints.Me
        )
        setProfileData({
          ...userProfile,
          fullname: values.fullname,
          email: values.email
        })
        toast.success("Profile updated.")
        location.reload()
      }catch(e) {
        const msg = getErrorMessage(e)
        toast.error(msg)
      }finally{
        setBusy(false)
      }
    },
  });

  const loadUser = useCallback(async () => {
    try {
      const data = await ApiServices(
        "get",
        null,
        ApiEndPoints.Me
      )
      setUser(data)
      formik.setValues({
        fullname: data.fullname,
        email: data.email
      })
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }
  }, [])

  useEffect(() => {
    loadUser()
  }, [loadUser]);



  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <BreadcrumbWithTitle title="Profile" />

          <Row className="justify-content-center">
            <Col lg="8">

              {/* Edit Profile Form */}
              <Card className="shadow mt-4" style={{ borderRadius: "12px", background: "#2d2d2d" }}>
                <CardBody>
                  <h4 className="card-title mb-4 text-center text-white">Edit Profile</h4>
                  <Form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-2">
                    <div>
                      <Label className="form-label">Full name</Label>
                      <Input
                        type="text"
                        name="fullname"
                        value={formik.values.fullname}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={
                          formik.touched.fullname &&
                          formik.errors.fullname
                            ? true
                            : false
                        }
                      />
                      {formik.touched.fullname &&
                      formik.errors.fullname ? (
                        <FormFeedback type="invalid">
                          {formik.errors.fullname}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div>
                      <Label className="form-label">Team</Label>
                      <div className="form-control">
                        {user?.team?.name || "Not set"}
                      </div>
                    </div>
                    <div>
                      <Label className="form-label">Position</Label>
                      <div className="form-control">
                        {user?.position || "Not set"}
                      </div>
                    </div>
                    <div>
                      <Label className="form-label">Role</Label>
                      <div className="form-control">
                        {ROLE_NAMES[user?.role] || "Not set"}
                      </div>
                    </div>
                    <div>
                      <Label className="form-label">Email</Label>
                      <Input
                        type="text"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        invalid={
                          formik.touched.email &&
                          formik.errors.email
                            ? true
                            : false
                        }
                      />
                      {formik.touched.email &&
                      formik.errors.email ? (
                        <FormFeedback type="invalid">
                          {formik.errors.email}
                        </FormFeedback>
                      ) : null}
                    </div>
                    <div>
                      <Button type="submit" color="primary">Save</Button>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ModalLoading
        isOpen={busy}
        onClose={() => {
          setBusy(false)
        }}
      />
    </React.Fragment>
  );
};

export default withRouter(UserProfile);
