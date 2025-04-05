import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import FormWeekReport from "../../components/FormWeekReport";
import ModalLoading from "../../components/ModalLoading";
import WeeklyReportGraphs from "../../components/WeeklyReportGraphs";
import { getWeeklyReportIndex } from "../../helpers/form_helper";
import { getErrorMessage } from "../../helpers/utils";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";

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

export default function WeeklyReportGraphPage() {

  const [openLoader, setOpenLoader] = useState(false)
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
        setOpenLoader(true);
        const payload = { index: getWeeklyReportIndex(values.selectedDate, values.tenant) };
        const data = await ApiServices('post', payload, ApiEndPoints.SearchData)
        setReportData(data)
      } catch (e) {
        console.log(e)
        const msg = getErrorMessage(e)
        toast.error(msg)
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
      {reportData.length ? (
        <WeeklyReportGraphs data={reportData[0]._source} />
      ) : null}
      <ModalLoading
        isOpen={openLoader}
        onClose={() => setOpenLoader(false)}
      />
    </div>
  )
}