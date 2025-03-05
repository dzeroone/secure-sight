import { format, getYear } from "date-fns";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import FormMonthReport from "../../components/FormMonthReport";
import ModalLoading from "../../components/modal-loading";
import MonthlyReportGraphs from "../../components/MonthlyReportGraphs";
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

export default function MonthlyReport() {
  const [busy, setBusy] = useState(false)
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
      } finally {
        setBusy(false);
      }
    }
  })

  const loadCustomers = useCallback(async () => {
    try {
      setBusy(true)
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
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    loadCustomers()
  }, [loadCustomers])

  return (
    <div className="page-content">
      <FormMonthReport
        formik={formik}
        customers={customers}
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