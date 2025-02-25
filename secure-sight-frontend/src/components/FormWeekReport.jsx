import { getDay, isAfter, isBefore, subDays } from "date-fns";
import { useCallback } from "react";
import ReactDatePicker from "react-datepicker";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";

export default function FormWeekReport({ formik }) {
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
              value={formik.values.tenant}
              onChange={formik.handleChange}
              invalid={!!formik.errors.tenant}
            />
            {formik.errors.tenant ? <FormFeedback>{formik.errors.tenant}</FormFeedback> : null}
          </FormGroup>
        </Col>
      </Row>
      <Button type="submit">Find</Button>
    </Form>
  )
}