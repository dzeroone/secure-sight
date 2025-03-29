import { useProfile } from "../../Hooks/UserHooks";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import FromCustomerDL from '../../components/FormCustomerDL';
import FormCustomerEdit from "../../components/FormCustomerEdit";
import { ROLES } from "../../data/app";

export default function EditCustomerPage(props) {
  const { userProfile } = useProfile()

  return (
    <div className="page-content">
      <BreadcrumbWithTitle title={ ROLES.ADMIN === userProfile.role ? "Edit customer" : "Edit customer DL"} />
      {userProfile.role === ROLES.ADMIN ? (
        <FormCustomerEdit />
      ) : (
        <FromCustomerDL />
      )}
    </div>
  )
}