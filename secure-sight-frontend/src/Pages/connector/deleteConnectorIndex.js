import { Backdrop, CircularProgress } from "@mui/material";
import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  Card,
  CardBody,
  CardTitle,
  Col,
  Container,
  Row,
  Table
} from "reactstrap";

//Import Breadcrumb
import { XIcon } from "lucide-react";
import { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import DeleteModal from "../Calender/DeleteModal";
import { allReplace } from "../ulit/commonFunction";

const DeleteConnectorIndexs = () => {
  const [openLoader, setOpenLoader] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [connectorListData, setConnectorListData] = useState([]);
  const [searchedVal, setSearchedVal] = useState("");
  const [connectorName, setConnectorName] = useState("");
  const [indexName, setIndexName] = useState("");
  const [indexList, setIndexList] = useState([]);
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
    connectorData(userInfo.dbName);
  }, []);

  //   ######################################## connector list  ##########################################
  const connectorData = async (item) => {
    setOpenLoader(true);
    const payload = {
      headers: { "Access-Control-Allow-Origin": "*" },
      info: { dbName: item },
    };
    const response = await ApiServices(
      "post",
      payload,
      ApiEndPoints.ConectoreList
    );
    setConnectorListData(response);
    setOpenLoader(false);
  };

  const HandleConnectorChange = async () => {
    setOpenLoader(true);
    setIndexList([]);
    let payload = { name: allReplace(connectorName, { _: "-" }) };
    const response = await ApiServices(
      "POST",
      payload,
      ApiEndPoints.ElasticIndexList
    );
    if (response) {
      setIndexList(response);
    }
    setOpenLoader(false);
  };
  const DeleteAlert = (item) => {
    setIndexName(item);
    setDeleteModal(true);
  };

  const DeleteIndex = async () => {
    setOpenLoader(!openLoader);
    const payload = { index: indexName };
    const response = await ApiServices(
      "DELETE",
      payload,
      ApiEndPoints.DeleteIndex
    );
    setOpenLoader(false);
    setDeleteModal(false);
    toast(response, { autoClose: 2000 });
    HandleConnectorChange();
  };
  return (
    <Fragment>
      <div className="page-content">
        <DeleteModal
          show={deleteModal}
          onDeleteClick={DeleteIndex}
          onCloseClick={() => setDeleteModal(false)}
        />
        <Container fluid={true}>
          <BreadcrumbWithTitle title="connector" />
          <Col xl={12}>
            <Card>
              <CardBody>
                <Row>
                  <Col md={6}>
                    <div className="form-floating mb-3">
                      <select
                        className="form-select"
                        id="floatingSelectGrid"
                        aria-label="Floating label select example"
                        onChange={(e) => {
                          setConnectorName(e.target.value);
                        }}
                      >
                        <option value="">Select Report</option>
                        {connectorListData &&
                          connectorListData.map((item, index) => (
                            <option value={item.display_name}>
                              {index + 1 + "  "}
                              {item.display_name}
                            </option>
                          ))}
                      </select>
                      <label htmlFor="floatingSelectGrid">
                        Select Connector
                      </label>
                    </div>
                  </Col>{" "}
                  <Col md={6}>
                    <button
                      disabled={!connectorName}
                      type="submit"
                      className="btn btn-primary w-md"
                      onClick={HandleConnectorChange}
                    >
                      Submit
                    </button>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
          <Row>
            <Col md={12}>
              <Card>
                <CardBody>
                  <CardTitle>
                    <div>
                      <Breadcrumbsub
                        title="Connector List"
                        breadcrumbItem={
                          <div className="input-group">
                            <button
                              onClick={() => {
                                setSearchedVal("");
                              }}
                              className="input-group-text"
                            >
                              <XIcon />
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
                  </CardTitle>
                  <Table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Index Name</th>

                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {indexList &&
                        indexList
                          .filter(
                            (x) =>
                              !searchedVal.length ||
                              x
                                .toString()
                                .toLowerCase()
                                .includes(searchedVal.toString().toLowerCase())
                          )
                          // .slice(
                          //   page * rowsPerPage,
                          //   page * rowsPerPage + rowsPerPage
                          // )
                          .map((item, index) => (
                            <tr>
                              <th scope="row">{index + 1}</th>
                              <td>{item}</td>

                              <td>
                                {/* <button
                                  onClick={() => {
                                    DeleteAlert(item);
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
                  </Table>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openLoader}
        onClick={() => setOpenLoader(false)}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Fragment>
  );
};

export default DeleteConnectorIndexs;
