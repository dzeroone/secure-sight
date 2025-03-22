import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApiServices from "../Network_call/apiservices";
import ApiEndPoints from "../Network_call/ApiEndPoints";
import ModalLoading from "./ModalLoading";
import { Button, Col, Container, Form, Label, Row } from "reactstrap";
import * as yup from 'yup';
import { Formik } from "formik";
import { InputField } from "./form-fields";
import { getErrorMessage } from "../helpers/utils";
import { toast } from "react-toastify";

const validationSchema = yup.object({
  emails: yup.object({
    to: yup.string().required("DL List (recipients) is required"),
    cc: yup.string().required("DL List (cc) is required"),
  }),
})

export default function FormCustomerDL() {
  const [busy, setBusy] = useState(false)

  const params = useParams()
  const id = params.id

  const [dlData, setDLData] = useState({
    proposal: null,
    customer: {}
  })

  const [initialValues, setInitialValues] = useState({
    emails: {
      to: '',
      cc: ''
    }
  })

  const getDLData = useCallback(async () => {
    try {
      setBusy(true)
      const response = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Customers}/${id}/dl`,
      );
      if(response.proposal) {
        setInitialValues({
          emails: response.proposal.emails
        })
      }
      setDLData(response)
    }catch(e) {
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }, [id])

  const onSubmit = async (values) => {
    try {
      setBusy(true)
      await ApiServices(
        'post',
        values,
        `${ApiEndPoints.Customers}/${id}/dl`,
      )
      toast.success("Data saved", {
        autoClose: 5000
      })
      getDLData()
    }catch(e){
      const msg = getErrorMessage(e)
      toast.error(msg, {
        autoClose: 5000
      })
    }finally{
      setBusy(false)
    }
  }

  useEffect(() => {
    getDLData()
  }, [getDLData])

  return (
    <div>
      <div className="px-2 py-1 mb-4 bg-pitch-black">
        <div>Customer name: {dlData.customer?.name}</div>
        <div>
          <Label className="mb-0">Emails</Label>
          <div className="d-flex gap-4">
            <div>To: {dlData.customer?.emails?.to}</div>
            <div>CC: {dlData.customer?.emails?.cc}</div>
          </div>
        </div>
      </div>
      <div>
        <h5>Your proposal</h5>
        <Formik
          initialValues = {initialValues}
          enableReinitialize={true}
          validationSchema = { validationSchema }
          onSubmit = {onSubmit}
        >
          { formik => {
            return (
              <Form onSubmit={formik.handleSubmit}>
                <Row className="mb-2">
                  <Col>
                    <fieldset className="border border-secondary rounded p-2">
                      <legend>DL List</legend>
                      <Row className="g-2">
                        <Col sm={6}>
                          <InputField
                            label='Recipients'
                            name='emails.to'
                            type="textarea"
                            hint="In case of multiple emails, use comma separated list"
                          />
                        </Col>
                        <Col sm={6}>
                          <InputField
                            label='CC Emails'
                            name='emails.cc'
                            type="textarea"
                            hint="In case of multiple emails, use comma separated list"
                          />
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                </Row>
                <Button color="primary">Save</Button>
              </Form>
            )
          }
        }
        </Formik>
      </div>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}