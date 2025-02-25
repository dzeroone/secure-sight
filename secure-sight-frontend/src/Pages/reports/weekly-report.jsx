import { useFormik } from "formik";
import { useState } from "react";
import FormWeekReport from "../../components/FormWeekReport";
import ModalLoading from "../../components/modal-loading";
import { getWeeklyReportPayload } from "../../helpers/form_helper";

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
        const payload = getWeeklyReportPayload(values);
        // console.log(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}?index=${payload.index}`)
        window.open(`${process.env.REACT_APP_WEEKLY_REPORT_BASE}?index=${payload.index}`, "_blank")
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