import { useCallback, useEffect, useState } from "react";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import TableView from "../../components/TableView";
import { useProfile } from "../../Hooks/UserHooks";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";
import swal from "sweetalert";
import { format } from "date-fns";
import { Button } from "reactstrap";
import { TrashIcon } from "lucide-react";

export default function DeletedCustomersPage() {
  const [customers, setCustomers] = useState([])
  const {userProfile} = useProfile()
  const [busy, setBusy] = useState(false)

  const getCustomers = useCallback(async () => {
    try {
      setBusy(true)
      const response = await ApiServices(
        'get',
        {
          status: -1
        },
        ApiEndPoints.Customers,
      );
      setCustomers(response)
    }catch(e){
      console.log(e)
    }finally{
      setBusy(false)
    }
  }, [])

  const deleteCustomer = async (customer) => {
    try {
      setBusy(true)
      await ApiServices(
        "delete",
        null,
        `${ApiEndPoints.Customers}/${customer._id}/permanent`
      )
      toast.success("Customer is deleted.")
      getCustomers()
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  const restoreCustomer = async (customer) => {
    try {
      setBusy(true)
      await ApiServices(
        "post",
        null,
        `${ApiEndPoints.Customers}/${customer._id}/restore`
      )
      toast.success("Customer is restored.")
      getCustomers()
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }

  const onClickDeleteCustomer = async (customer) => {
    try {
      const confirmed = await swal({
        title: 'Are you sure?',
        text: 'Your action will permanently remove this customer!',
        buttons: [true, "Okay"]
      })
      if(confirmed) {
        deleteCustomer(customer)
      }
    }catch(e) {

    }
  }

  const onClickRestore = async (customer) => {
    try {
      const confirmed = await swal({
        title: 'Are you sure?',
        text: 'Your action will restore this customer!',
        buttons: [true, "Okay"]
      })
      if(confirmed) {
        restoreCustomer(customer)
      }
    }catch(e) {

    }
  }

  const formatDate = (d) => {
    return format(d, 'MMM dd, yyyy')
  }

  useEffect(() => {
    getCustomers()
  }, [getCustomers])


  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Delete customers" />
      <TableView
        columns={[
          {
            key: 'name',
            title: 'Name'
          },
          {
            key: 'tCode',
            title: 'Tanent code'
          },
          {
            key: 'msd',
            title: 'Monitoring start date',
            onRenderRow: (data) => {
              return formatDate(data.msDate)
            }
          },
          {
            key: 'med',
            title: 'Monitoring end date',
            onRenderRow: (data) => {
              return formatDate(data.meDate)
            }
          },
          {
            key: 'actions',
            title: '',
            onRenderRow: (data) => {
              return (
                <div className="d-flex gap-2">
                  <Button size="sm" onClick={() => onClickRestore(data)}>
                    Restore
                  </Button>
                  <Button size="sm" onClick={() => onClickDeleteCustomer(data)}>
                    <TrashIcon size="1rem" />
                  </Button>
                </div>
              )
            }
          }
        ]}
        data={customers}
      />
    </div>
  )
}