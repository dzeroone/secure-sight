import { format } from "date-fns";
import { useFormik } from "formik";
import { FileStack } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody } from "reactstrap";
import ApiEndPoints from "../Network_call/ApiEndPoints";
import ApiServices from "../Network_call/apiservices";
import { getMonthlyReportIndex } from "../helpers/form_helper";
import { getErrorMessage, pluralize } from "../helpers/utils";
import FormMonthReport from "./FormMonthReport";
import ModalLoading from "./ModalLoading";

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

export default function MonthlyReportSearch() {
  const [busy, setBusy] = useState(false)

  const [existingReports, setExistingReports] = useState({
    count: 0,
    data: []
  })

  const formik = useFormik({
    initialValues: {
      selectedDate: null,
      tenant: ''
    },
    validate,
    async onSubmit(values) {
      try {
        setBusy(true);
        const index = getMonthlyReportIndex(values.selectedDate, values.tenant)
        // console.log(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}?index=${payload.index}`)
        window.open(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}/monthly-report?index=${index}`, "_blank")
        // const data = await ApiServices('post', payload, ApiEndPoints.SearchData)
        // setReportData(data)
      } catch (e) {
        console.log(e)
      } finally {
        setBusy(false);
      }
    }
  })

  const findExistingReports = useCallback(async () => {
      if(!formik.values.tenant) {
        setExistingReports([])
        return
      }
      try {
        setBusy(true)
        const res = await ApiServices(
          'get',
          {
            index: getMonthlyReportIndex(formik.values.selectedDate, formik.values.tenant)
          },
          `${ApiEndPoints.AssignmentReports}/monthly`
        )
        setExistingReports(res)
      }catch(e) {
        const msg = getErrorMessage(e)
        toast.error(msg)
      }finally{
        setBusy(false)
      }
    }, [formik.values.tenant])
  
    useEffect(() => {
      findExistingReports()
    }, [findExistingReports])

  return (
    <div>
      <FormMonthReport
        formik={formik}
        afterForm={
          <div className="mt-4">
            Find your
            <a
              href={`${process.env.REACT_APP_MONTHLY_REPORT_BASE}/monthly-report/saved`}
              className="btn-link ms-1"
              target="_blank"
            >saved reports <FileStack size="1rem" /></a>
          </div>
        }
      />
      {existingReports?.data?.length ? (
        <Card>
          <CardBody>
            <div>You have {pluralize(existingReports.count, 'saved report')} for this tenant</div>
            <div className="d-flex flex-column gap-2 mt-2">
              {existingReports.data.map((r, i) => {
                return (
                  <div key={r._id}>
                    <div><a href={`${process.env.REACT_APP_MONTHLY_REPORT_BASE}/monthly-report?id=${r._id}`} target="_blank" className="btn-link">Report {i+1}</a></div>
                    <div><small>Updated at: {format(r.uAt, 'PPpp')}</small></div>
                  </div>
                )
              })}
            </div>
          </CardBody>
        </Card>
      ) : null}
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}