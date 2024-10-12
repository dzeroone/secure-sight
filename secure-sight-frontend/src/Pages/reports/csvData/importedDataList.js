import React, { useEffect, useState } from "react";
import { Row, Col, Card, CardBody } from "reactstrap";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
import { Backdrop, CircularProgress } from "@mui/material";
import { CloseOutlined } from "@mui/icons-material";
import Breadcrumbs, {
  Breadcrumbsub,
} from "../../../components/Common/Breadcrumb";
import ApiServices from "../../../Network_call/apiservices";
import ApiEndPoints from "../../../Network_call/ApiEndPoints";
import DeleteModal from "../../../components/Common/DeleteModal";

const CSVDataList = () => {
  document.title = "CSV Data | Secure Sight";
  const [csvList, setCSVList] = useState([]);
  const [openLoader, setOpenLoader] = React.useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [csvDataId, setCSVDataId] = useState("");
  const [searchedVal, setSearchedVal] = useState("");

  useEffect(() => {
    getCSVData();
  }, []);

  // Function to fetch all CSV data
  const getCSVData = async () => {
    setOpenLoader(true);
    try {
      const response = await ApiServices("get", {}, ApiEndPoints.FileList);
      if (response.success) {
        setCSVList(response.data);
      } else {
        toast(response.msg, { autoClose: 2000 });
      }
    } catch (error) {
      console.error("Error fetching CSV data:", error);
      toast("Error fetching CSV data", { autoClose: 2000 });
    } finally {
      setOpenLoader(false);
    }
  };

  // Function to delete CSV data
  const DeleteAlert = (item) => {
    setCSVDataId(item);
    setDeleteModal(true);
  };

  const DeleteCSVData = async () => {
    setOpenLoader(true);
    let payload = {
      _id: csvDataId,
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.FileDelete
    );
    setDeleteModal(false);
    toast(response.msg, { autoClose: 2000 });
    getCSVData(); // Refresh the list
    setOpenLoader(false);
  };

  return (
    <React.Fragment>
      <ToastContainer />
      <div className="page-content">
        <div className="container-fluid">
          <DeleteModal
            show={deleteModal}
            onDeleteClick={DeleteCSVData}
            onCloseClick={() => setDeleteModal(false)}
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
                          <th>File Name</th>
                          <th>Created Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {csvList &&
                          csvList
                            .filter(
                              (x) =>
                                !searchedVal.length ||
                                x.document_name
                                  .toString()
                                  .toLowerCase()
                                  .includes(searchedVal.toLowerCase())
                            )
                            .map((item, index) => (
                              <tr key={item._id}>
                                <th scope="row">{index + 1}</th>
                                <td>
                                  <Link
                                    to={`/csv-list/${item._id}`} // Updated link to view CSV file
                                  >
                                    {item.document_name}
                                  </Link>
                                </td>
                                <td>
                                  {new Date(
                                    item.upload_date
                                  ).toLocaleDateString()}
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
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoader}
        onClick={() => setOpenLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </React.Fragment>
  );
};

export default CSVDataList;
