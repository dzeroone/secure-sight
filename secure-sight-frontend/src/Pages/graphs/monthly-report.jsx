import { useFormik } from "formik";
import { useState } from "react";
import { toast } from "react-toastify";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import FormMonthReport from "../../components/FormMonthReport";
import ModalLoading from "../../components/ModalLoading";
import MonthlyReportGraphs from "../../components/MonthlyReportGraphs";
import { getMonthlyReportIndex } from "../../helpers/form_helper";
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

        let payload = {
          index: getMonthlyReportIndex(values.selectedDate, values.tenant),
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
      <BreadcrumbWithTitle title="Monthly report graphs" />

      <FormMonthReport
        formik={formik}
        btnText='View graphs'
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