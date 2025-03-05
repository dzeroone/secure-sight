import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import FormWeekReport from "../../components/FormWeekReport";
import { getWeeklyReportPayload } from "../../helpers/form_helper";
import ModalLoading from "../../components/modal-loading";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import WeeklyReportGraphs from "../../components/WeeklyReportGraphs";

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
  const [reportData, setReportData] = useState([])
  const [customers, setCustomers] = useState([])

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
        const payload = getWeeklyReportPayload(values);
        const data = await ApiServices('post', payload, ApiEndPoints.SearchData)
        setReportData(data)
      } catch (e) {
        console.log(e)
      } finally {
        setOpenLoader(false);
      }
    }
  })

  const loadCustomers = useCallback(async () => {
    try {
      setOpenLoader(true)
      const data = await ApiServices(
        'get',
        null,
        ApiEndPoints.Customers
      )
      setCustomers(data)
    }catch(e){
      console.error(e)
      alert(e.message)
    }finally{
      setOpenLoader(false)
    }
  }, [])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  return (
    <div className="page-content">
      <FormWeekReport
        formik={formik}
        customers={customers}
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