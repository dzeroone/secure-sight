import { useCallback, useEffect, useRef, useState } from "react";
import BreadcrumbWithTitle from "../components/Common/BreadcrumbWithTitle";
import { getErrorMessage } from "../helpers/utils";
import { toast } from "react-toastify";
import ApiServices from "../Network_call/apiservices";
import ApiEndPoints from "../Network_call/ApiEndPoints";
import ModalLoading from "../components/ModalLoading";
import { Button, Card, CardBody, CardFooter, Input, Table } from "reactstrap";
import { EditIcon, TrashIcon } from "lucide-react";
import swal from "sweetalert";

export default function CountrySettingsPage() {

  const [busy, setBusy] = useState(false)
  const [country, setCountry] = useState('')
  const [countries, setCountries] = useState([])
  const [mode, setMode] = useState('insert')
  const refEditingItem = useRef(null)


  const loadData = useCallback(async () => {
    try {
      setBusy(true)
      const data = await ApiServices(
        "get",
        null,
        ApiEndPoints.Countries
      )
      setCountries(data)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  const saveCountry = async () => {
    try {
      setBusy(true)
      if(mode == 'insert') {
        await ApiServices(
          "post",
          {
            title: country
          },
          ApiEndPoints.Countries
        )
        toast.success("Country added")
      }else{
        await ApiServices(
          "patch",
          {
            title: country
          },
          `${ApiEndPoints.Countries}/${refEditingItem.current._id}`
        )
        toast.success("Country edited")
        setMode('insert')
        refEditingItem.current = null
      }

      setCountry('')
      loadData()
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  const onClickEdit = async (item) => {
    setMode('edit')
    refEditingItem.current = item
    setCountry(item.title)
  }

  const onClickDelete = async (item) => {
    try {
      const comfirmed = await swal({
        icon: "warning",
        title: "Warning",
        text: "You are going remove this country!",
        buttons: {
          cancel: true,
          confirm: true
        }
      })
      if(comfirmed) {
        await ApiServices(
          "delete",
          null,
          `${ApiEndPoints.Countries}/${item._id}`
        )
        toast.success("Country deleted")
        loadData()
      }
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }
  }

  useEffect(() => {
    loadData()
  }, [loadData])

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Countries" />
      <Card>
        <CardBody>
          <div>{mode == 'insert' ? 'Add' : 'Edit'} country</div>
          <div className="d-flex gap-2">
            <Input
              value={country}
              placeholder="Country name"
              onChange={(e) => {
                setCountry(e.target.value)
              }}
            />
            <Button onClick={saveCountry}>Save</Button>
          </div>
        </CardBody>
      </Card>
      <Table>
        <thead>
          <tr>
            <td>Country name</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {
            countries.map(c => {
              return (
                <tr key={c._id}>
                  <td>{c.title}</td>
                  <td>
                    <div className="d-flex gap-1">
                      <Button size="sm" onClick={() => onClickEdit(c)}>
                        <EditIcon size="1rem" />
                      </Button>
                      <Button size="sm" onClick={() => onClickDelete(c)}>
                        <TrashIcon size="1rem" />
                      </Button>
                    </div>
                  </td>
                </tr>
              )
            })
          }
        </tbody>
      </Table>
      <ModalLoading
        isOpen={busy}
        onClose={() => {
          setBusy(false)
        }}
      />
    </div>
  )
}