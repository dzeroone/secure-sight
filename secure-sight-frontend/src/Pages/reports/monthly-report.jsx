import { format, getYear } from "date-fns";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import FormMonthReport from "../../components/FormMonthReport";
import ModalLoading from "../../components/modal-loading";
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
  const [customers, setCustomers] = useState([])
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
        const month = format(values.selectedDate, 'MMMM').toLowerCase()
        const year = getYear(values.selectedDate)
        const tenant = values.tenant.toLowerCase()

        let payload = {
          index: `${month}_${year}_${tenant}_report`,
          column: []
        }
        // console.log(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}?index=${payload.index}`)
        window.open(`${process.env.REACT_APP_MONTHLY_REPORT_BASE}?index=${payload.index}`, "_blank")
        // const data = await ApiServices('post', payload, ApiEndPoints.SearchData)
        // setReportData(data)
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
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}