import { useFormik } from "formik";
import * as Yup from 'yup';
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Form, FormFeedback, Input, Label } from "reactstrap";
import { useState } from "react";
import ModalLoading from "../../components/ModalLoading";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";

export default function NewUserPage(props) {
  const [busy, setBusy] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: "",
      fullname: "",
      username: "",
      password: "",
      role: 'l1'
    },
    validationSchema: Yup.object({
      email: Yup.string()
        .email("Invalid email format")
        .required("Please enter email"),
      fullname: Yup.string().required("Please enter full name"),
      username: Yup.string().required("Please enter username"),
      password: Yup.string().required("Please enter password"),
      role: Yup.string().required("Please select a role"),
    }),
    onSubmit: async (values, {resetForm}) => {
      try {
        setBusy(true)
        const response = await ApiServices(
          'post',
          values,
          ApiEndPoints.Users,
        );
        if(response.success === false) {
          toast(response.message, {
            autoClose: 2000
          })
          return
        }
        toast('Data saved.', {
          autoClose: 2000
        })
        resetForm()
        // Handle success (optional)
      } catch (e) {
        if (e.response) {
          // The request was made and the server responded with a status code
          // that falls out of the range of 2xx
          let res = e.response.data
          toast(res.data.message, {
            autoClose: 2000
          })
        } else if (e.request) {
          // The request was made but no response was received
          // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
          // http.ClientRequest in node.js
          console.log(e.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', e.message);
        }
      }finally{
        setBusy(false)
      }
    },
  });
  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="New user" />
      <Card>
        <CardBody>
          <Form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-2">
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
              <Label className="form-label">Username</Label>
              <Input
                type="text"
                name="username"
                value={formik.values.username}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={
                  formik.touched.username &&
                  formik.errors.username
                    ? true
                    : false
                }
              />
              {formik.touched.username &&
              formik.errors.username ? (
                <FormFeedback type="invalid">
                  {formik.errors.username}
                </FormFeedback>
              ) : null}
            </div>
            <div>
              <Label className="form-label">Password</Label>
              <Input
                type="password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={
                  formik.touched.password &&
                  formik.errors.password
                    ? true
                    : false
                }
              />
              {formik.touched.password &&
              formik.errors.password ? (
                <FormFeedback type="invalid">
                  {formik.errors.password}
                </FormFeedback>
              ) : null}
            </div>
            <div>
              <Label className="form-label">Role</Label>
              <Input
                type="select"
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={
                  formik.touched.role &&
                  formik.errors.role
                    ? true
                    : false
                }
              >
                <option value='l1'>Level 1</option>
                <option value='l2'>Level 2</option>
                <option value='l3'>Level 3</option>
              </Input>
              {formik.touched.role &&
              formik.errors.role ? (
                <FormFeedback type="invalid">
                  {formik.errors.role}
                </FormFeedback>
              ) : null}
            </div>
            <div>
              <Button type="submit" color="primary">Save</Button>
            </div>
          </Form>
        </CardBody>
      </Card>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}