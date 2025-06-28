import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ApiServices from "../Network_call/apiservices"
import ApiEndPoints from "../Network_call/ApiEndPoints"
import { FormCustomer } from "./FormCustomer"
import ModalLoading from "./ModalLoading"
import { toast } from "react-toastify"
import { getErrorMessage } from "../helpers/utils"

export default function FormCustomerEdit() {
  const params = useParams()
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
      response.tType = response.tType || ''
      response.tCon = response.tCon || ''
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
        toast.error(response.message, {
          autoClose: 2000
        })
        return
      }
      toast.success('Data saved.', {
        autoClose: 2000
      })
      // Handle success (optional)
    } catch (e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
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
    <div>
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