import { format } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { toast } from "react-toastify";
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import ApiEndPoints from "../Network_call/ApiEndPoints";
import ApiServices from "../Network_call/apiservices";
import { getErrorMessage } from "../helpers/utils";

export default function FormMonthReport({ formik, btnText, afterForm }) {
  const [busy, setBusy] = useState(false)
  const [info, setInfo] = useState({
    customers: [],
    assigned: []
  })

  const loadInfo = useCallback(async () => {
    if(!formik.values.selectedDate) return
    formik.setFieldValue('tenant', '')
    try {
      setBusy(true)
      const data = await ApiServices(
        'get',
        {
          type: 'monthly',
          date: format(formik.values.selectedDate, 'yyyy-MM-dd')
        },
        `${ApiEndPoints.Customers}/codes`
      )
      setInfo(data)
    }catch(e){
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [formik.values.selectedDate])

  useEffect(() => {
    loadInfo()
  }, [loadInfo])

  return (
    <Card>
      <CardBody>
        <Form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-2">
          <Row>
            <Col xs="auto">
              <FormGroup>
                <Label>
                  Select month
                </Label>
                <div className={!!formik.errors.selectedDate ? 'is-invalid' : ''}>
                  <ReactDatePicker
                    className={`form-control ${!!formik.errors.selectedDate ? 'is-invalid' : ''}`}
                    name="selectedDate"
                    selected={formik.values.selectedDate}
                    onChange={(date) => formik.setFieldValue('selectedDate', date)}
                    showMonthYearPicker
                    showFullMonthYearPicker
                    autoComplete="off"
                  />
                </div>
                {formik.errors.selectedDate ? <FormFeedback>{formik.errors.selectedDate}</FormFeedback> : null}
              </FormGroup>
            </Col>
            <Col>
              {formik.values.selectedDate ? (
                <FormGroup>
                  <Label>
                    Tenant
                  </Label>
                  <Input
                    name="tenant"
                    type="select"
                    value={formik.values.tenant}
                    onChange={formik.handleChange}
                    invalid={!!formik.errors.tenant}
                    disabled={busy}
                  >
                    <option value='' disabled>Select a tenant</option>
                    {info.customers?.map(customer => {
                      return (
                        <option value={customer.tCode} disabled={info.assigned.some((ac) => customer.tCode == ac.tCode)} key={customer._id}>{customer.name}</option>
                      )
                    })}
                  </Input>
                  {formik.errors.tenant ? <FormFeedback>{formik.errors.tenant}</FormFeedback> : null}
                </FormGroup>
              ) : null}
            </Col>
          </Row>
          <Row>
            <Col>
              <Button type="submit" color="primary" disabled={busy}>{btnText ? btnText : 'Create new report'}</Button>
            </Col>
          </Row>
        </Form>
        {afterForm}
      </CardBody>
    </Card>
  )
}