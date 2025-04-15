import { Formik } from "formik";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
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

export default function TeamNew() {
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  const onSubmit = useCallback(async (values) => {
    try {
      setBusy(true)
      await ApiServices(
        "post",
        values,
        ApiEndPoints.Teams
      )
      toast.success("Team has been created.")
      navigate("/teams")
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  })

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="New team" />
      <Formik
        initialValues={{
          name: ''
        }}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
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