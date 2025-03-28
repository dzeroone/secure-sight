import { format, getYear } from "date-fns";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import FormMonthReport from "../../components/FormMonthReport";
import ModalLoading from "../../components/ModalLoading";
import MonthlyReportGraphs from "../../components/MonthlyReportGraphs";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";

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

export default function MonthlyReportGraphPage() {
  const [busy, setBusy] = useState(false)
  const [reportData, setReportData] = useState([])

  const formik = useFormik({
    initialValues: {
      selectedDate: null,
      tenant: ''
    },
    validate,
    async onSubmit(values) {
      try {
        setReportData([])
        setBusy(true);
        const month = format(values.selectedDate, 'MMMM').toLowerCase()
        const year = getYear(values.selectedDate)
        const tenant = values.tenant.toLowerCase()

        let payload = {
          index: `${month}_${year}_${tenant}_report`,
          column: []
        }
        const data = await ApiServices('post', payload, ApiEndPoints.SearchData)
        setReportData(data)
      } catch (e) {
        console.log(e)
        const msg = getErrorMessage(e)
        toast.error(msg)
      } finally {
        setBusy(false);
      }
    }
  })


  return (
    <div className="page-content">
      <FormMonthReport
        formik={formik}
      />
      {reportData.length ? (
        <MonthlyReportGraphs data={reportData[0]._source} />
      ) : null}
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}