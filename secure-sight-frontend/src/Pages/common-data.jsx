import { useCallback, useEffect, useState } from "react";
import BreadcrumbWithTitle from "../components/Common/BreadcrumbWithTitle";
import * as yup from 'yup'
import { FieldArray, Formik } from "formik";
import { Button, Col, Container, Form, Row } from "reactstrap";
import { InputField } from "../components/form-fields";
import { TrashIcon } from "lucide-react";
import ModalLoading from "../components/ModalLoading";
import { getErrorMessage } from "../helpers/utils";
import { toast } from "react-toastify";
import ApiServices from "../Network_call/apiservices";
import ApiEndPoints from "../Network_call/ApiEndPoints";

const validationSchema = yup.object({
  tg_cyber_cri: yup.array().of(yup.object({ // Top Global Cyber Criminals
    title: yup.string(),
    desc: yup.string()
  })),
  tg_vul: yup.array().of(yup.object({ // Top Global Vulnerabilities
    title: yup.string(),
    desc: yup.string()
  })),
  tg_mal: yup.array().of(yup.object({ // Top Global Malware
    title: yup.string(),
    desc: yup.string()
  })),
  tg_mitre: yup.array().of(yup.object({ // Top Global MITRE ATT&CK Techniques
    title: yup.string(),
    desc: yup.string()
  })),
  threat_intel_summary: yup.object({
    advisory_chart: yup.object({
      ioc: yup.number().default(0),
      advisories: yup.number().default(0)
    }),
    total_ioc_sweep: yup.number(),
    ioc_chart: yup.object({
      ip: yup.number().default(0),
      url: yup.number().default(0),
      domain: yup.number().default(0),
      hash: yup.number().default(0),
      sender_email: yup.number().default(0)
    })
  })
})

function FormSectionTitle({ children }) {
  return (
    <div className="h5 py-2 position-sticky" style={{background: 'var(--bs-gray-900)', top: '70px', zIndex: 1}}>{children}</div>
  )
}

function CommonDataFieldArray({
  title,
  name,
  values
}) {
  return (
    <FieldArray
      name={name}
      render={arrayHelpers => (
        <Container fluid className="border p-2 rounded">
          <FormSectionTitle>{title}</FormSectionTitle>
          {values && values.length ? (
            <Row className="mb-2 g-4">
            {
              values.map((d, i) => (
                <Col md="6">
                  <fieldset className="d-flex flex-column position-relative gap-2" key={i}>
                    <InputField
                      name={`${name}.${i}.title`}
                      label="Title"
                      placeholder="Write title..."
                    />
                    <InputField
                      type="textarea"
                      name={`${name}.${i}.desc`}
                      label="Description"
                      placeholder="Write description..."
                    />
                    <Button
                      size="sm"
                      className="position-absolute end-0 top-0"
                      onClick={() => {
                        arrayHelpers.remove(i)
                      }}
                    >
                      <TrashIcon size="1rem" />
                    </Button>
                  </fieldset>
                </Col>)
              )
            }
            </Row>
          ) : null}
          <Button onClick={() => {
            arrayHelpers.push({
              title: '',
              desc: ''
            })
          }}>
            Add more
          </Button>
        </Container>
      )}
    />
  )
}

export default function CommonDataPage() {
  const [initialValues, setInitialValues] = useState({
    tg_cyber_cri: [],
    tg_vul: [],
    tg_mal: [],
    tg_mitre: [],
    threat_intel_summary: {
      advisory_chart: {
        ioc: 0,
        advisories: 0
      },
      ioc_chart: {
        ip: 0,
        url: 0,
        domain: 0,
        hash: 0,
        sender_email: 0
      }
    }
  })

  const [busy, setBusy] = useState(false)

  const loadData = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        "get",
        null,
        `${ApiEndPoints.CommonData}/monthly`
      )
      setInitialValues({
        ...res
      })
    }catch(e){
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const onSubmit = async (values) => {
    try {
      setBusy(true)
      await ApiServices(
        "post",
        values,
        `${ApiEndPoints.CommonData}/monthly`
      )
      toast.success("Data saved")
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Common Data" />
      <Formik
        initialValues={initialValues}
        enableReinitialize={true}
        validationSchema={validationSchema}
        onSubmit={onSubmit}
      >
        {
          formik => {
            return (
              <Form onSubmit={formik.handleSubmit} className="d-flex flex-column gap-3">
                <div>
                  <CommonDataFieldArray
                    title="Top Global Cyber Criminals"
                    name="tg_cyber_cri"
                    values={formik.values.tg_cyber_cri}
                  />
                </div>
                <div>
                  <CommonDataFieldArray
                    title="Top Global Vulnerabilities"
                    name="tg_vul"
                    values={formik.values.tg_vul}
                  />
                </div>
                <div>
                  <CommonDataFieldArray
                    title="Top Global Malware"
                    name="tg_mal"
                    values={formik.values.tg_mal}
                  />
                </div>
                <div>
                  <CommonDataFieldArray
                    title="Top Global MITRE ATTACK Techniques"
                    name="tg_mitre"
                    values={formik.values.tg_mitre}
                  />
                </div>
                <div>
                  <Container fluid className="border p-2 rounded">
                    <FormSectionTitle>Threat intel summary</FormSectionTitle>
                    <Row className="mb-2 g-4">
                      <Col md="12">
                        <div className="h6">Advisory count for the month</div>
                        <Row className="g-2">
                          <Col md="6">
                            <InputField
                              type="number"
                              name={`threat_intel_summary.advisory_chart.ioc`}
                              label="IOC-Based Advisories"
                            />
                          </Col>
                          <Col md="6">
                            <InputField
                              type="number"
                              name={`threat_intel_summary.advisory_chart.advisories`}
                              label="Vulnerability Advisories"
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col md="12">
                        <InputField
                          type="number"
                          name={`threat_intel_summary.total_ioc_sweep`}
                          label="Total IOC Sweep for the Month"
                        />
                      </Col>
                      <Col md="12">
                        <div className="h6">Indicators of compromise(IOC) Match against Sweeped</div>
                        <Row className="g-2">
                          <Col md="6">
                            <InputField
                              type="number"
                              name={`threat_intel_summary.ioc_chart.ip`}
                              label="IP"
                            />
                          </Col>
                          <Col md="6">
                            <InputField
                              type="number"
                              name={`threat_intel_summary.ioc_chart.url`}
                              label="URL"
                            />
                          </Col>
                          <Col md="6">
                            <InputField
                              type="number"
                              name={`threat_intel_summary.ioc_chart.domain`}
                              label="Domain"
                            />
                          </Col>
                          <Col md="6">
                            <InputField
                              type="number"
                              name={`threat_intel_summary.ioc_chart.hash`}
                              label="Hash"
                            />
                          </Col>
                          <Col md="6">
                            <InputField
                              type="number"
                              name={`threat_intel_summary.ioc_chart.sender_email`}
                              label="Sender Mail ID"
                            />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Container>
                </div>
                <div>
                  <Button type="submit">Save</Button>
                </div>
              </Form>
            )
          }
        }
      </Formik>
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}