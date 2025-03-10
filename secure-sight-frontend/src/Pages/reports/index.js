import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import ReactGridLayout from "react-grid-layout";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import DeleteModal from "../../components/Common/DeleteModal";
import EditModals, {
  EditHeaderModals,
  ReorderColumnsModels,
} from "../../components/Common/editModel";
import ModalLoading from "../../components/ModalLoading";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import CreateSubReport from "./createSubReport";
import CostomDropdow from "../../components/Common/costomDropdown";
import UserReport from './userReport'

const ResponsiveReactGridLayout = ReactGridLayout.WidthProvider(
  ReactGridLayout.Responsive
);

const Report = () => {
  // document.title = "Report | trend micro unity";
  document.title = "Report | Secure Sight";
  let param = useParams();
  const [deleteModal, setDeleteModal] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [editHeaderModal, setEditHeaderModal] = useState(false);
  const [reorderHeaderModal, setReorderHeaderModal] = useState(false);
  const [reportInfo, setReportInfo] = useState(null);
  const [reportData, setReportData] = useState([]);
  const [tableData, setTableData] = useState({
    title: "",
    Id: "",
  });
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const [headerEdit, setHeaderEdit] = useState({
    column: [],
    data: [],
    headerName: [],
  });
  const [userData, setUserData] = useState(null);

  const reportRef = useRef();

  const loadReportInfo = useCallback(async () => {
    try {
      const response = await ApiServices(
        "get",
        null,
        `${ApiEndPoints.Report}/${param.id}`
      );
      setReportInfo(response)
    } catch (e) {
      console.log(e)
    }
  }, [])

  useEffect(() => {
    let userObject = localStorage.getItem("authUser");
    var userInfo = userObject ? JSON.parse(userObject) : "";

    setUserData(() => ({
      email: userInfo.email,
      dbName: userInfo.dbName,
      user_id: userInfo._id,
    }));
  }, []);

  useEffect(() => {
    if (userData) {
      GetReportList(param.id);
      loadReportInfo();
    }
  }, [param.id, userData]);

  //   ############################################ report list ##########################################
  const GetReportList = async (item) => {
    setOpenLoader(true);
    setReportData([]);
    setTableData({ title: "", Id: "" });
    let payload = {
      info: { dbName: userData.dbName },
      data: { report_id: param.id, user_id: userData.user_id },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.GetReportData
    );
    if (response.success) {
      setReportData(response.data);
    }
    setOpenLoader(false);
  };
  //   ############################################ edit and delete model ##########################################

  const OpenDeleteModel = (item) => {
    setTableData((prev) => ({
      ...prev,
      Id: item,
    }));
    setDeleteModal(true);
  };
  const OpenEditModel = ({ id, title }) => {
    setTableData({
      Id: id,
      title: title,
    });
    setEditModal(true);
  };
  const OpenHeaderEditModel = (Data) => {
    setHeaderEdit({
      headerName: Data.headerName,
      data: Data.data,
      column: Data.column,
    });
    setTableData((prev) => ({
      ...prev,
      Id: Data._id,
    }));
    setEditHeaderModal(true);
  };
  const OpenHeaderReorderModel = (Data) => {
    setHeaderEdit({
      headerName: Data.headerName,
      data: Data.data,
      column: Data.column,
    });
    setTableData((prev) => ({ ...prev, Id: Data._id }));
    setReorderHeaderModal(true);
  };
  const handelEditHeaderChange = (e) => {
    const { name, value } = e.target;
    headerEdit.headerName[name] = value;
  };
  const handelReorderHeader = ({ column, header }) => {
    headerEdit.column = column;
    headerEdit.headerName = header;
  };

  const tableTitleChange = (e) => {
    setTableData((prev) => ({
      ...prev,
      title: e.target.value,
    }));
  };

  //   ############################################ edit and delete model ##########################################

  const UpdateTableTitle = async (item) => {
    setOpenLoader(true);
    let payload = {
      info: {
        dbName: userData.dbName,
        user_id: userData.user_id,
        table_id: tableData.Id,
        report_id: param.id,
      },
      data: { title: tableData.title },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.UpdateReportTitle
    );

    toast(response.msg);
    GetReportList(param.id);
    setEditModal(false);
    setOpenLoader(false);
  };
  const UpdateTableData = async (item) => {
    setOpenLoader(true);
    let payload = {
      info: {
        dbName: userData.dbName,
        user_id: userData.user_id,
        id: tableData.Id,
        report_id: param.id,
        column: headerEdit.column,
        headerName: headerEdit.headerName,
      },
      data: { data: headerEdit.data },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.UpdateReportData
    );

    toast(response.msg);
    setReorderHeaderModal(false);
    setEditHeaderModal(false);
    GetReportList(param.id);
    setOpenLoader(false);
  };

  const DeleteReport = async () => {
    setOpenLoader(true);
    let payload = {
      dbName: userData.dbName,
      user_id: userData.user_id,
      report_id: param.id,
      id: tableData.Id,
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.DeleteReportData
    );
    toast(response.msg);
    GetReportList(param.id);
    setDeleteModal(false);
    setOpenLoader(false);
  };
  //   ############################################ export report   ##########################################
  const exportContent = useMemo(() => {
    return reportRef.current;
  }, [reportRef.current]);

  //   ############################################ report show ##########################################

  const layout = reportData && { i: reportData._id, x: 0, y: 0, w: 12, h: 5 };

  return (
    <Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={DeleteReport}
        onCloseClick={() => setDeleteModal(false)}
      />
      <EditModals
        title="Edit Table Title"
        show={editModal}
        onCloseClick={() => setEditModal(false)}
        onClick={UpdateTableTitle}
        value={tableData.title}
        onInputChange={tableTitleChange}
      />
      <EditHeaderModals
        show={editHeaderModal}
        onCloseClick={() => setEditHeaderModal(false)}
        onClick={UpdateTableData}
        data={headerEdit}
        handelChange={handelEditHeaderChange}
      />
      <ReorderColumnsModels
        data={headerEdit}
        open={reorderHeaderModal}
        habndelClose={() => {
          setReorderHeaderModal();
        }}
        onClick={UpdateTableData}
        onChange={handelReorderHeader}
      />
      <div className="page-content">
        <Breadcrumbs title="Report" breadcrumbItem={reportInfo ? reportInfo.reportName : param.id} />
        <CreateSubReport reportId={param.id} GetReportData={GetReportList} />
        {/* <ResponsiveReactGridLayout
          layouts={{ lg: layout }}
          measureBeforeMount={true}
          className="layout"
          isDragable={true}
          isResizable={true}
          margin={[0, 25]}
        > */}
        {/* </ResponsiveReactGridLayout> */}
        {reportData.map(data => (<div key={data._id} ref={reportRef}>
          <CostomDropdow
            i={data}
            OpenEditModel={OpenEditModel}
            OpenHeaderEditModel={OpenHeaderEditModel}
            OpenDeleteModel={OpenDeleteModel}
            exportContent={exportContent}
            OpenHeaderReorderModel={OpenHeaderReorderModel}
          />
          <UserReport
            data={data}
            userData={userData}
            report_id={data._id}
          />
        </div>))}{" "}

      </div>
      <ModalLoading
        isOpen={openLoader}
        onClose={() => setOpenLoader(fales)}
      />
    </Fragment>
  );
};

export default Report;
const drrr = [
  "account-id",
  "attributes.rule-title",
  "attributes.service",
  "attributes.provider",
  "attributes.categories",
  "attributes.risk-level",
  "attributes.status",
  "attributes.message",
  "account-details.name",
  "attributes.region",
];
