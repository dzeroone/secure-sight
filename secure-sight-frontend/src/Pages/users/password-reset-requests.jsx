import { useCallback, useEffect, useState } from "react";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import { Button, Table } from "reactstrap";
import TableView from "../../components/TableView";
import { Edit2Icon } from "lucide-react";
import ModalLoading from "../../components/ModalLoading";
import { Link } from "react-router-dom";

export default function PasswordResetRequestsPage() {
  const [busy, setBusy] = useState(false)

  const [data, setData] = useState([])
  
  const getPasswordResetRequests = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        "get",
        null,
        ApiEndPoints.AuthPasswordResetRequests
      )
      setData(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg)
    }finally{
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    getPasswordResetRequests()
  }, [getPasswordResetRequests])
  return (
    <div className="page-content">
      <BreadcrumbWithTitle title="Password reset requests" />
      <TableView
        data={data}
        columns={[
          {
            key: 'fullname',
            title: 'User',
            onRenderRow(item) {
              return item.user.fullname
            }
          },
          {
            key: 'email',
            title: 'Email',
            onRenderRow(item) {
              return item.user.email
            }
          },
          {
            key: 'action',
            title: '',
            onRenderRow(item) {
              return <Link to={`/users/${item.userId}`} className="btn btn-primary"><Edit2Icon size="1em" /></Link>
            }
          }
        ]}
      />
      <ModalLoading isOpen={busy} onClose={() => setBusy(false)} />
    </div>
  )
}