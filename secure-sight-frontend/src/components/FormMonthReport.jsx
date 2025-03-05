import { getDay, isAfter, isBefore, subDays } from "date-fns";
import { useCallback } from "react";
import ReactDatePicker from "react-datepicker";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";

export default function FormMonthReport({ formik, customers }) {
  const filterDate = useCallback((date) => {
    const day = getDay(date);
    return day === 1
  }, [])

  return (
    <Form onSubmit={formik.handleSubmit} className="mb-4">
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
                  <option value={customer.tCode}>{customer.tCode}</option>
                )
              })}
            </Input>
            {formik.errors.tenant ? <FormFeedback>{formik.errors.tenant}</FormFeedback> : null}
          </FormGroup>
        </Col>
      </Row>
      <Button type="submit">Find</Button>
    </Form>
  )
}