import { format, getDay, isAfter, isBefore, subDays } from "date-fns";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Button, Card, CardBody, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import ApiServices from "../Network_call/apiservices";
import ApiEndPoints from "../Network_call/ApiEndPoints";

export default function FormWeekReport({ formik }) {
  const [busy, setBusy] = useState(false)
  const [customers, setCustomers] = useState([])

  const filterDate = useCallback((date) => {
    const day = getDay(date);
    return day === 1
  }, [])

  const loadCustomers = useCallback(async () => {
    if(!formik.values.selectedDate) return
    formik.setFieldValue('tenant', '')
    try {
      setBusy(true)
      const data = await ApiServices(
        'get',
        {
          type: 'weekly',
          date: format(formik.values.selectedDate, 'yyyy-MM-dd')
        },
        `${ApiEndPoints.Customers}/codes`
      )
      setCustomers(data)
    }catch(e){
      console.error(e)
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }, [formik.values.selectedDate])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  return (
    <Card>
      <CardBody>
        <Form onSubmit={formik.handleSubmit}>
          <Row>
            <Col xs="auto">
              <FormGroup>
                <Label>
                  Select week
                </Label>
                <div>
                  <ReactDatePicker
                    className={`form-control ${!!formik.errors.selectedDate ? 'is-invalid' : ''}`}
                    name="selectedDate"
                    selected={formik.values.selectedDate}
                    onChange={(date) => formik.setFieldValue('selectedDate', date)}
                    filterDate={filterDate}
                    dayClassName={(date) =>
                      formik.values.selectedDate && isAfter(date, subDays(formik.values.selectedDate, 8)) && isBefore(date, formik.values.selectedDate) ? "bg-primary" : undefined
                    }
                    shouldCloseOnSelect={false}
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
                    className="text-uppercase"
                  >
                    <option value='' disabled>Select a tenant</option>
                    {customers?.map(customer => {
                      return (
                        <option value={customer.tCode} key={customer._id}>{customer.tCode}</option>
                      )
                    })}
                  </Input>
                  {formik.errors.tenant ? <FormFeedback>{formik.errors.tenant}</FormFeedback> : null}
                </FormGroup>
              ) : null}
            </Col>
          </Row>
          <Button type="submit">Find</Button>
        </Form>
      </CardBody>
    </Card>
  )
}