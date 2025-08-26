import { useCallback, useEffect, useMemo, useState } from "react";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import { getErrorMessage } from "../../helpers/utils";
import { toast } from "react-toastify";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ModalLoading from "../../components/ModalLoading";
import ListDLChanges from "../../components/ListDLChanges";
import ListPendingAssignmentReviews from "../../components/ListPendingAssignmentReviews";
import { useSelector } from "react-redux";
import { Alert } from "reactstrap";
import { Link } from "react-router-dom";

export default function DashboardPage() {
  const [busy, setBusy] = useState(false)
  const user = useSelector(s => s.login.user)

  const [dashboardData, setDashboardData] = useState({
    submissions: [],
    dlChanges: []
  })

  const isClean = useMemo(() => {
    return !(dashboardData.submissions.length || dashboardData.dlChanges.length)
  }, [dashboardData])

  const loadDashboardData = useCallback(async () => {
    try {
      setBusy(true)
      const res = await ApiServices(
        'get',
        null,
        `${ApiEndPoints.Users}/me/dashboard`
      )
      setDashboardData(res)
    }catch(e) {
      const msg = getErrorMessage(e)
      toast.error(msg, {
        autoClose: 5000
      })
    }finally{
      setBusy(false)
    }
  }, [])

  useEffect(() => {
    loadDashboardData()
  }, [loadDashboardData])

  return (
    <div className="page-content">
      {user && user.promptPassChange ? (
        <div className="">
          <Alert color='info'>
            <div className='d-flex justify-content-between'>
              <div>Your password has been reset. Please change your password immediately.</div>
              <Link to={'/userprofile'} className='alert-link'>Change Password</Link>
            </div>
          </Alert>
        </div>
      ) : null}
      <BreadcrumbWithTitle title="Dashboard" />
      {/* <div>
        <div className="w-50 border border-info border-opacity-25 p-2 rounded" style={{ minHeight: '10rem'}}>
          <div>Summary</div>
          <hr />
          {isClean ? (
            "Everything is clean."
          ) : null}
          <ListDLChanges data={dashboardData.dlChanges} />
          <ListPendingAssignmentReviews data={dashboardData.submissions} />
        </div>
      </div> */}
      <ModalLoading
        isOpen={busy}
        onClose={() => setBusy(false)}
      />
    </div>
  )
}