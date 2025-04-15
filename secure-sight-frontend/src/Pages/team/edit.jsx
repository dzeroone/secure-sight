import { Formik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form } from "reactstrap";
import * as yup from 'yup';
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { InputField } from "../../components/form-fields";
import ModalLoading from "../../components/ModalLoading";
import { getErrorMessage } from "../../helpers/utils";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";

const validationSchema = yup.object({
  name: yup.string().required('Team name is required')
})

export default function TeamEdit() {
  const [busy, setBusy] = useState(false)
  const params = useParams()
  const id = params.id
  const navigate = useNavigate()

  const [initialValues, setInitialValues] = useState({
    name: ''
  })

  const getTeam = useCallback(async () => {
    try {
      setBusy(true)
      const data = await ApiServices(
        "get",
        null,
        `${ApiEndPoints.Teams}/${id}`
      )
      setInitialValues({
        name: data.name
      })
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [id])

  const onSubmit = useCallback(async (values) => {
    try {
      setBusy(true)
      await ApiServices(
        "patch",
        values,
        `${ApiEndPoints.Teams}/${id}`
      )
      toast.success("Team data has been updated.")
      navigate("/teams")
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  })

  useEffect(() => {
    getTeam()
  }, [getTeam])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="New team" />
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
        enableReinitialize
      >
        {(formik) => {
          return (
            <Form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-2">
              <div>
                <InputField
                  name='name'
                  label='Name'
                />
              </div>
              <div>
                <Button>Save</Button>
              </div>
            </Form>
          )
        }}
      </Formik>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}