import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { FormCustomer } from "../../components/FormCustomer";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";

export default function NewCustomerPage(props) {
  const [connectors, setConnectors] = useState([])
  const [busy, setBusy] = useState(false)

  const defaultValues = useMemo(() => {
    return {
      name: "",
      tCode: "",
      msDate: "",
      meDate: "",
      emails: {
        to: '',
        cc: ''
      },
      apiConfig: {
        apex: {
          baseUrl: '',
          appId: '',
          apiKey: ''
        },
        tmv: {
          baseUrl: '',
          apiKey: ''
        },
        soar: {
          baseUrl: '',
          apiKey: ''
        },
        cas: {
          baseUrl: '',
          apiKey: ''
        },
        caw: {
          baseUrl: '',
          apiKey: ''
        },
        ds: {
          baseUrl: '',
          apiKey: ''
        }
      },
      connectors: []
    }
  }, [])

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
  
  const handleSubmit = useCallback(async (values, {resetForm}) => {
    try {
      setBusy(true)
      const response = await ApiServices(
        'post',
        values,
        ApiEndPoints.Customers,
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
      resetForm()
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
  }, [])

  useEffect(() => {
    loadConnectors()
  }, [loadConnectors])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="New customer" />
      <FormCustomer
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        connectors={connectors}
      />
    </div>
  )
}