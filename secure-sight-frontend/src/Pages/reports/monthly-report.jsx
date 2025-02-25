import { useFormik } from "formik";
import { useCallback, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { Button, Col, Form, FormFeedback, FormGroup, Input, Label, Row } from "reactstrap";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { format, getMonth, getYear } from "date-fns";
import ModalLoading from "../../components/modal-loading";
import MonthlyReportGraphs from "../../components/MonthlyReportGraphs";

const validate = values => {
  const errors = {};

  if (!values.selectedDate) {
    errors.selectedDate = "Selected date cannot be empty"
  }

  if (!values.tenant) {
    errors.tenant = "Tenant cannot be empty"
  }

  return errors
}

export default function MonthlyReport() {
  const [openLoader, setOpenLoader] = useState(false)

  const formik = useFormik({
    initialValues: {
      selectedDate: null,
      tenant: ''
    },
    validate,
    async onSubmit(values) {
      try {
        setOpenLoader(true);
        const month = format(values.selectedDate, 'MMMM').toLowerCase()
        const year = getYear(values.selectedDate)
        const tenant = values.tenant.toLowerCase()

        let payload = {
          index: `${month}_${year}_${tenant}_report`,
          column: []
        }
        // console.log(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}?index=${payload.index}`)
        window.open(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}?index=${payload.index}`, "_blank")
        // const data = await ApiServices('post', payload, ApiEndPoints.SearchData)
        // setReportData(data)
      } catch (e) {
        console.log(e)
      } finally {
        setOpenLoader(false);
      }
    }
  })

  return (
    <div className="page-content">
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
      <ModalLoading
        isOpen={openLoader}
        onClose={() => setOpenLoader(false)}
      />
    </div>
  )
}