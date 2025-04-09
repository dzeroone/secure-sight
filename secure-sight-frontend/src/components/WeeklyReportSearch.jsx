import { format } from "date-fns";
import { useFormik } from "formik";
import { FileStack } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Card, CardBody } from "reactstrap";
import { getWeeklyReportIndex } from "../helpers/form_helper";
import { getErrorMessage, pluralize } from "../helpers/utils";
import ApiEndPoints from "../Network_call/ApiEndPoints";
import ApiServices from "../Network_call/apiservices";
import FormWeekReport from "./FormWeekReport";
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

export default function WeeklyReportSearch() {
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
        window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?index=${getWeeklyReportIndex(values.selectedDate, values.tenant)}`, "_blank")
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
          index: getWeeklyReportIndex(formik.values.selectedDate, formik.values.tenant)
        },
        `${ApiEndPoints.AssignmentReports}/weekly`
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
      <FormWeekReport
        formik={formik}
        afterForm={
          <div className="mt-4">
            Find your
            <a
              href={`${process.env.REACT_APP_WEEKLY_REPORT_BASE}/saved`}
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
                    <div><a href={`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?id=${r._id}`} target="_blank" className="btn-link">Report {i+1}</a></div>
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