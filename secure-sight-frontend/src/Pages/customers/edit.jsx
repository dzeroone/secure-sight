import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Form, FormFeedback, Input, Label } from "reactstrap";
import * as Yup from 'yup';
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import { FormCustomer } from "../../components/FormCustomer";
import ModalLoading from "../../components/modal-loading";

export default function EditCustomerPage(props) {
  document.title = "Customer Edit | Secure Sight";

  const params = useParams()
  const navigate = useNavigate()
  const id = params.id

  const [defaultValues, setDefaultValues] = useState(null)
  const [connectors, setConnectors] = useState([])
  const [busy, setBusy] = useState(false)

  const getCustomer = useCallback(async () => {
    try {
      setBusy(true)
      const response = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Customers}/${id}`,
      );
      response.msDate = new Date(response.msDate)
      response.meDate = new Date(response.meDate)
      setDefaultValues(response)
    }catch(e) {
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }, [id])

  const loadConnectors = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        null,
        ApiEndPoints.ConnectorList
      )
      setConnectors(res)
    }catch(e) {
      alert(e.message)
    }finally{
      setBusy(false)
    }
  }, [])

  const handleSubmit = useCallback(async (values) => {
    try {
      setBusy(true)
      const connectorIds = connectors.map(c => c._id)
      values.connectors = values.connectors.filter(c => connectorIds.includes(c))

      const response = await ApiServices(
        'patch',
        values,
        `${ApiEndPoints.Customers}/${id}`,
      );
      if(response.success === false) {
        toast(response.message, {
          autoClose: 2000
        })
        return
      }
      toast('Data saved.', {
        autoClose: 2000
      })
      // Handle success (optional)
    } catch (e) {
      if (e.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        let res = e.response.data
        toast(res.data.message, {
          autoClose: 2000
        })
      } else if (e.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(e.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', e.message);
      }
    }finally{
      setBusy(false)
    }
  }, [connectors])

  // fixing any unwanted value for connectors in saved customer config
  useEffect(() => {
    if(Array.isArray(connectors) && connectors.length && defaultValues) {
      setDefaultValues(s => {
        const connectorIds = connectors.map(c => c._id)
        s.connectors = s.connectors.filter(c => connectorIds.includes(c))
        return {...s}
      })
    }
  }, [connectors])

  useEffect(() => {
    getCustomer()
  }, [getCustomer])

  useEffect(() => {
    loadConnectors()
  }, [loadConnectors])

  return (
    <div className="page-content">
      <h1>Edit customer</h1>
      <FormCustomer
        enableReinitialize={true}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        connectors={connectors}
      />
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}