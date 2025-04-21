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
import { ROLES } from "../../data/app";
import { useProfile } from "../../Hooks/UserHooks";
import { getErrorMessage } from "../../helpers/utils";

export default function EditUserPage(props) {
  const params = useParams()
  const navigate = useNavigate()
  const id = params.id
  const { userProfile } = useProfile()

  const [busy, setBusy] = useState(false)
  const [teams, setTeams] = useState([])

  const formik = useFormik({
    initialValues: {
      fullname: "",
      team: "",
      position: "",
      email: "",
      role: 'l1'
    },
    validationSchema: Yup.object({
      fullname: Yup.string().required("Please enter full name"),
      team: Yup.string().optional("Please enter team"),
      position: Yup.string().required("Please enter position"),
      email: Yup.string().required("Please enter email"),
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
        toast.success('Data saved.')
        navigate('/users')
        // Handle success (optional)
      } catch (e) {
        const msg = getErrorMessage(e)
        toast.error(msg)
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
        team: response.team || '',
        position: response.position || '',
        email: response.email || '',
        role: response.role
      }
      formik.setValues(formData)
    }catch(e) {
      console.log(e)
    }
  }, [id])

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
    getUser()
  }, [getUser])

  useEffect(() => {
    getTeams()
  }, [getTeams])

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