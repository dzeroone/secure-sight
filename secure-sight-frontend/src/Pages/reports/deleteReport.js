import { Fragment, useEffect, useState } from "react";

import { Row, Col, Card, CardBody } from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";

//Import Breadcrumb
import Breadcrumbs, { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import { toast } from "react-toastify";
import ApiServices from "../../Network_call/apiservices";
import ApiEndPoints from "../../Network_call/ApiEndPoints";

import EditModals from "../../components/Common/editModel";
import { Link } from "react-router-dom";
import { CloseOutlined } from "@mui/icons-material";
import DeleteModal from "../../components/Common/DeleteModal";
import ModalLoading from "../../components/ModalLoading";

const DeleteReport = () => {
  document.title = "Report | Secure Sight";
  const [reportList, setReportList] = useState([]);
  const [openLoader, setOpenLoader] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [reportsName, setReportName] = useState("");
  const [searchedVal, setSearchedVal] = useState("");
  const [reportId, setReportId] = useState("");
  const [userData, setUserData] = useState({
    email: "",
    dbName: "",
    user_id: "",
  });
  useEffect(() => {
    let userObject = localStorage.getItem("authUser");
    var userInfo = userObject ? JSON.parse(userObject) : "";
    setUserData(() => ({
      email: userInfo.email,
      dbName: userInfo.dbName,
      user_id: userInfo._id,
    }));
    loadReportList({
      dbName: userInfo.dbName,
      userId: userInfo._id
    });
  }, []);

  const loadReportList = async ({ dbName, userId }) => {
    try {
      setOpenLoader(true)
      let payload = { dbName: dbName, user_id: userId };
      const response = await ApiServices(
        "post",
        payload,
        ApiEndPoints.GetReportList
      );
      if (response.success) {
        setReportList(response.data);
      }
    } catch (e) {
      toast(e.message, { autoClose: 5000 })
    } finally {
      setOpenLoader(false)
    }
  }

  // ####################################delete dashboard ####################################
  const DeleteAlert = (item) => {
    setReportId(item);
    setDeleteModal(true);
  };
  const DeleteReport = async () => {
    setOpenLoader(true);
    let payload = {
      dbName: userData.dbName,
      user_id: userData.user_id,
      id: reportId,
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.DeleteReport
    );
    toast(response.msg, { autoClose: 2000 });

    loadReportList({
      dbName: userData.dbName,
      userId: userData.user_id
    });
    setOpenLoader(false);
  };
  // #################################### edit report ####################################
  const OpenEditModel = ({ id, name }) => {
    setReportId(id);
    setReportName(name);
    setEditModal(true);
  };
  const onchange = (e) => {
    setReportName(e.target.value);
  };
  const UpdateReport = async () => {
    setOpenLoader(true);
    let payload = {
      info: {
        dbName: userData.dbName,
        user_id: userData.user_id,
        report_id: reportId,
      },
      data: { reportName: reportsName },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.UpdateReport
    );
    toast(response.msg);
    if (response) {
      loadReportList({
        dbName: userData.dbName,
        userId: userData.user_id
      });
    }
    setOpenLoader(false);
  };
  return (
    <Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <DeleteModal
            show={deleteModal}
            onDeleteClick={DeleteReport}
            onCloseClick={() => setDeleteModal(false)}
          />
          <EditModals
            title="Edit Dashboard Title"
            show={editModal}
            onCloseClick={() => setEditModal(false)}
            onClick={UpdateReport}
            value={reportsName}
            onInputChange={onchange}
          />
          <Breadcrumbs title="Report" breadcrumbItem="List" />

          <Row>
            <Col lg={12}>
              <Card>
                <CardBody>
                  <div>
                    <Breadcrumbsub
                      title="Report List"
                      breadcrumbItem={
                        <div className="input-group">
                          <button
                            onClick={() => {
                              setSearchedVal("");
                            }}
                            className="input-group-text"
                          >
                            <CloseOutlined />
                          </button>
                          <input
                            type="text"
                            className="form-control"
                            id="autoSizingInputGroup"
                            placeholder="Search"
                            value={searchedVal}
                            onChange={(e) => {
                              setSearchedVal(e.target.value);
                            }}
                          />
                        </div>
                      }
                    />
                  </div>

                  <div className="table-responsive">
                    <table className="table table-hover mb-0">
                      <thead>
                        <tr>
                          <th>No.</th>

                          <th>Report Name</th>
                          <th>Created Date</th>
                          <th>Updated Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {reportList &&
                          reportList
                            .filter(
                              (x) =>
                                !searchedVal.length ||
                                x.reportName
                                  .toString()
                                  .toLowerCase()
                                  .includes(
                                    searchedVal.toString().toLowerCase()
                                  ) ||
                                x.created_at
                                  .toString()
                                  .toLowerCase()
                                  .includes(
                                    searchedVal.toString().toLowerCase()
                                  )
                            )
                            .map((item, index) => (
                              <tr key={item._id}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                  <Link to={"/reports/" + item._id}>
                                    {item.reportName}
                                  </Link>
                                </td>

                                <td>{item.created_at}</td>
                                <td>{item.updated_at}</td>
                                <td>
                                  <button
                                    onClick={() => {
                                      OpenEditModel({
                                        id: item._id,
                                        name: item.reportName,
                                      });
                                    }}
                                    type="button"
                                    className="btn  noti-icon  m-0 p-0    "
                                  >
                                    <i className="mdi mdi-playlist-edit"></i>
                                  </button>
                                  {/* <button
                                    onClick={() => {
                                      DeleteAlert(item._id);
                                    }}
                                    type="button"
                                    className="btn  noti-icon  m-0 p-0    "
                                  >
                                    <i className="mdi mdi-delete"></i>
                                  </button> */}
                                </td>
                              </tr>
                            ))}
                      </tbody>
                    </table>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>{" "}
      <ModalLoading
        isOpen={openLoader}
        onClose={() => setOpenLoader(false)}
      />
    </Fragment>
  );
};

export default DeleteReport;













































