import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import FormWeekReport from "../../components/FormWeekReport";
import ModalLoading from "../../components/modal-loading";
import { getWeeklyReportIndex } from "../../helpers/form_helper";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";

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

export default function WeeklyReport() {
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
        window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?index=${getWeeklyReportIndex(values.selectedDate, values.tenant)}`, "_blank")
      } catch (e) {
        console.log(e)
      } finally {
        setOpenLoader(false);
      }
    }
  })

  return (
    <div className="page-content">
      <FormWeekReport
        formik={formik}
      />
      <ModalLoading
        isOpen={openLoader}
        onClose={() => setOpenLoader(false)}
      />
    </div>
  )
}