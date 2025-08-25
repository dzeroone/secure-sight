import { useFormik } from "formik";
import * as Yup from 'yup';
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Form, FormFeedback, Input, Label } from "reactstrap";
import { useCallback, useEffect, useState } from "react";
import ModalLoading from "../../components/ModalLoading";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { useProfile } from "../../Hooks/UserHooks";
import { ROLES } from "../../data/app";
import { getErrorMessage } from "../../helpers/utils";

export default function NewUserPage(props) {
  const [busy, setBusy] = useState(false)
  const { userProfile } = useProfile()
  const [teams, setTeams] = useState([])

  const formik = useFormik({
    initialValues: {
      fullname: "",
      team: "",
      position: "",
      role: 'l1',
      email: "",
      contact: "",
      password: ""
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Please enter full name"),
      team: Yup.string().optional("Please enter team"),
      position: Yup.string().required("Please enter position"),
      role: Yup.string().required("Please select a role"),
      email: Yup.string().required("Please enter email"),
      contact: Yup.string().required("Please enter contact"),
      password: Yup.string().required("Please enter password"),
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
        toast.success('Data saved.')
        resetForm()
        // Handle success (optional)
      } catch (e) {
        const msg = getErrorMessage(e)
        toast.error(msg)
      }finally{
        setBusy(false)
      }
    },
  });

  const getTeams = useCallback(async () => {
    try {
      setBusy(true)
      const data = await ApiServices(
        "get",
        null,
        ApiEndPoints.Teams
      )
      setTeams(data)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    getTeams()
  }, [getTeams])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="New user" />
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
              <Label className="form-label">Team</Label>
              <Input
                type="select"
                name="team"
                value={formik.values.team}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={
                  formik.touched.team &&
                  formik.errors.team
                    ? true
                    : false
                }
              >
                <option value='' disabled>No team</option>
                {teams.map(t => {
                  return <option value={t._id} key={t._id}>{t.name}</option>
                })}
              </Input>
              {formik.touched.role &&
              formik.errors.role ? (
                <FormFeedback type="invalid">
                  {formik.errors.role}
                </FormFeedback>
              ) : null}
            </div>
            <div>
              <Label className="form-label">Position</Label>
              <Input
                type="text"
                name="position"
                value={formik.values.position}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={
                  formik.touched.position &&
                  formik.errors.position
                    ? true
                    : false
                }
              />
              {formik.touched.position &&
              formik.errors.position ? (
                <FormFeedback type="invalid">
                  {formik.errors.position}
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
                {userProfile.role === ROLES.ADMIN ? (
                  <option value='l3'>Level 3</option>
                ): null}
                {formik.values.role === ROLES.ADMIN ? (
                  <option value='admin'>Admin</option>
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
              <Label className="form-label">Contact</Label>
              <Input
                type="text"
                name="contact"
                value={formik.values.contact}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                invalid={
                  formik.touched.contact &&
                  formik.errors.contact
                    ? true
                    : false
                }
              />
              {formik.touched.contact &&
              formik.errors.contact ? (
                <FormFeedback type="invalid">
                  {formik.errors.contact}
                </FormFeedback>
              ) : null}
            </div>
            <div>
              <Label className="form-label">Temporary password</Label>
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