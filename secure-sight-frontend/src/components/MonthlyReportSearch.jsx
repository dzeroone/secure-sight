import { useState } from "react";
import FormMonthReport from "./FormMonthReport";
import ModalLoading from "./ModalLoading";
import { useFormik } from "formik";
import { format, getYear } from "date-fns";
import { getMonthlyReportIndex } from "../helpers/form_helper";

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
        window.open(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}?index=${index}`, "_blank")
        // const data = await ApiServices('post', payload, ApiEndPoints.SearchData)
        // setReportData(data)
      } catch (e) {
        console.log(e)
      } finally {
        setBusy(false);
      }
    }
  })

  return (
    <div>
      <FormMonthReport
        formik={formik}
      />
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}