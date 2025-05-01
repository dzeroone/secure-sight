import { FieldArray, Formik } from "formik"
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Label, Row } from "reactstrap"
import { CheckboxArrayField, CheckboxField, DateField, InputField } from "./form-fields"

import yup from "../helpers/yup.extras"

const validationSchema = yup.object({
  name: yup.string().required("Please enter customer name"),
  tCode: yup.string().required("Please enter tenant code"),
  tType: yup.string().optional(),
  msDate: yup.date().required('Monitoring start date is required'),
  meDate: yup.date().required('Monitoring end date is required'),
  emails: yup.object({
    to: yup.string().required("DL List (recipients) is required"),
    cc: yup.string().required("DL List (cc) is required"),
  }),
  apiConfig: yup.object({
    apex: yup.object({
      baseUrl: yup.string().url('APEX One base url should be a valid URL').required('APEX One base url is required'),
      appId: yup.string().required('APEX One application ID is required'),
      apiKey: yup.string().required('APEX One API key is required'),
    }),
    tmv: yup.object({
      baseUrl: yup.string().url().required('TM Vision One base url is required'),
      apiKey: yup.string().required('TM Vision One API key is required'),
    }),
    soar: yup.object({
      baseUrl: yup.string().url().required('SOAR base url is required'),
      apiKey: yup.string().required('SOAR API key is required'),
    }),
    cas: yup.object({
      baseUrl: yup.string().url().required('Cloud App Security base url is required'),
      apiKey: yup.string().required('Cloud App Security API key is required'),
    }),
    caw: yup.object({
      baseUrl: yup.string().url().required('Cloud One Workload Security base url is required'),
      apiKey: yup.string().required('Cloud One Workload Security API key is required'),
    }),
    ds: yup.object({
      baseUrl: yup.mixed().oneOfSchemas([
        yup.string().url('Deep Security base url is required'),
        yup.string().ipv4('Deep Security base ip is required')
      ]),
      apiKey: yup.string(),
    }),
  }),
  connectors: yup.array().of(yup.string()).min(1, "Minimum one connector should be selected")
})

export function FormCustomer({
  enableReinitialize = false,
  defaultValues,
  onSubmit,
  connectors
}) {

  return (
    <Card>
      <CardBody>
        <Formik
          initialValues = {defaultValues}
          enableReinitialize={enableReinitialize}
          validationSchema = { validationSchema }
          onSubmit = {onSubmit}
        >
          { formik => {
            return <Form onSubmit={formik.handleSubmit}>
              <Container fluid>
                <Row className="g-2">
                  <Col sm={4}>
                    <InputField
                      label='Name'
                      name='name'
                    />
                  </Col>
                  <Col sm={4}>
                    <InputField
                      label='Tenant code'
                      name='tCode'
                    />
                  </Col>
                  <Col sm={4}>
                    <InputField
                      type="select"
                      label='Tenant type'
                      name='tType'
                    >
                      <option value="" disabled>None</option>
                      <option value="IN">IN</option>
                      <option value="SG">SG</option>
                      <option value="INS">INS</option>
                    </InputField>
                  </Col>
                  <Col sm={6}>
                    <DateField
                      label='Monitoring start date'
                      name='msDate'
                    />
                  </Col>
                  <Col sm={6}>
                    <DateField
                      label='Monitoring end date'
                      name='meDate'
                    />
                  </Col>
                  <Col sm={12}>
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
                  <Col sm={12}>
                    <fieldset className="border border-secondary rounded p-2">
                      <legend>APEX One</legend>
                      <Row className="g-2">
                        <Col sm={12}>
                          <InputField
                            label='Base URL'
                            name='apiConfig.apex.baseUrl'
                          />
                        </Col>
                        <Col sm={6}>
                          <InputField
                            label='Application ID'
                            name='apiConfig.apex.appId'
                          />
                        </Col>
                        <Col sm={6}>
                          <InputField
                            label='API Key'
                            name='apiConfig.apex.apiKey'
                          />
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                  <Col sm={12}>
                    <fieldset className="border border-secondary rounded p-2">
                      <legend>TM Vision One</legend>
                      <Row className="g-2">
                        <Col sm={6}>
                          <InputField
                            label='Base URL'
                            name='apiConfig.tmv.baseUrl'
                          />
                        </Col>
                        <Col sm={6}>
                          <InputField
                            label='API Key'
                            name='apiConfig.tmv.apiKey'
                          />
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                  <Col sm={12}>
                    <fieldset className="border border-secondary rounded p-2">
                      <legend>SOAR</legend>
                      <Row className="g-2">
                        <Col sm={6}>
                          <InputField
                            label='Base URL'
                            name='apiConfig.soar.baseUrl'
                          />
                        </Col>
                        <Col sm={6}>
                          <InputField
                            label='API Key'
                            name='apiConfig.soar.apiKey'
                          />
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                  <Col sm={12}>
                    <fieldset className="border border-secondary rounded p-2">
                      <legend>Cloud App Security</legend>
                      <Row className="g-2">
                        <Col sm={6}>
                          <InputField
                            label='Base URL'
                            name='apiConfig.cas.baseUrl'
                          />
                        </Col>
                        <Col sm={6}>
                          <InputField
                            label='API Key'
                            name='apiConfig.cas.apiKey'
                          />
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                  <Col sm={12}>
                    <fieldset className="border border-secondary rounded p-2">
                      <legend>Cloud One Workload Security</legend>
                      <Row className="g-2">
                        <Col sm={6}>
                          <InputField
                            label='Base URL'
                            name='apiConfig.caw.baseUrl'
                          />
                        </Col>
                        <Col sm={6}>
                          <InputField
                            label='API Key'
                            name='apiConfig.caw.apiKey'
                          />
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                  <Col sm={12}>
                    <fieldset className="border border-secondary rounded p-2">
                      <legend>Deep Security</legend>
                      <Row className="g-2">
                        <Col sm={6}>
                          <InputField
                            label='Base URL'
                            name='apiConfig.ds.baseUrl'
                          />
                        </Col>
                        <Col sm={6}>
                          <InputField
                            label='API Key'
                            name='apiConfig.ds.apiKey'
                          />
                        </Col>
                      </Row>
                    </fieldset>
                  </Col>
                  <Col sm={12}>
                    <Label>Connectors</Label>
                    <FieldArray name="connectors">
                      {(arrayHelpers) => (
                        <div>
                        {connectors.map((c, i) => {
                          return <CheckboxArrayField
                            name="connectors"
                            index={i}
                            label={c.name.replaceAll('_', ' ')}
                            arrayHelpers={arrayHelpers}
                            value={c._id}
                            className="text-capitalize"
                            inputClassName="me-1"
                            key={c._id}
                          />
                        })}
                        </div>
                      )}
                    </FieldArray>
                    { typeof formik.errors['connectors'] == 'string' ? <FormFeedback type="invalid" className="d-block">{formik.errors['connectors']}</FormFeedback> : null}
                  </Col>
                  <Col sm={12}>
                    <Button type="submit" color="primary">Save</Button>
                  </Col>
                </Row>
              </Container>
            </Form>
          }}
        </Formik>
      </CardBody>
    </Card>
  )
}