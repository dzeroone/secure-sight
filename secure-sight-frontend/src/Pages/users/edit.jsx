import { useFormik } from "formik";
import * as Yup from 'yup';
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Form, FormFeedback, Input, Label } from "reactstrap";
import { useNavigate, useNavigation, useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import ModalLoading from "../../components/ModalLoading";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { ROLES } from "../../data/roles";

export default function EditUserPage(props) {
  const params = useParams()
  const navigate = useNavigate()
  const id = params.id

  const [busy, setBusy] = useState(false)

  const formik = useFormik({
    initialValues: {
      fullname: "",
      username: "",
      password: "",
      role: 'l1'
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Please enter full name"),
      username: Yup.string().required("Please enter username"),
      password: Yup.string().optional(),
      role: Yup.string().required("Please select a role"),
    }),
    onSubmit: async (values, {resetForm}) => {
      setBusy(true)
      try {
        const response = await ApiServices(
          'patch',
          values,
          `${ApiEndPoints.Users}/${id}`,
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
        navigate('/users')
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

  const getUser = useCallback(async () => {
    try {
      const response = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Users}/${id}`,
      );
      const formData = {
        fullname: response.fullname || '',
        username: response.username || '',
        password: '',
        role: response.role
      }
      formik.setValues(formData)
    }catch(e) {
      console.log(e)
    }
  }, [id])

  useEffect(() => {
    getUser()
  }, [getUser])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Edit user" />
      <Card>
        <CardBody>
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
                disabled={formik.values.role === 'admin'}
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
                <option value='' disabled>None</option>
                <option value='l1'>Level 1</option>
                <option value='l2'>Level 2</option>
                {formik.values.role === ROLES.ADMIN ? (
                  <>
                    <option value='l3'>Level 3</option>
                    <option value='admin'>Admin</option>
                  </>
                ) : null}
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