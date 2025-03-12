import { useState } from "react";
import FormMonthReport from "./FormMonthReport";
import ModalLoading from "./ModalLoading";
import { useFormik } from "formik";
import { format, getYear } from "date-fns";
import { getMonthlyReportIndex, getWeeklyReportIndex } from "../helpers/form_helper";
import FormWeekReport from "./FormWeekReport";

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

  return (
    <div>
      <FormWeekReport
        formik={formik}
      />
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}