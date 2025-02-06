import { ConstructionOutlined, Download } from '@mui/icons-material';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Dropdown,
  DropdownMenu,
  DropdownToggle,
  Row
} from 'reactstrap';
import ApiEndPoints from '../../Network_call/ApiEndPoints';
import ApiServices from '../../Network_call/apiservices';
import MaterialTable from '../Tables/Table';
import {
  Columns,
  allReplace,
  deepKeys,
  flattenObj,
  formatCapilize,
  getFields,
  hidencolumn
} from '../ulit/commonFunction';
import ExportCSV from '../ulit/exportCSV';
import ModalLoading from '../../components/modal-loading';

const CreateSubReport = ({ reportId, GetReportData }) => {
  const [btnprimary1, setBtnprimary1] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const [connectorList, setConnectorList] = useState([]);
  const [indexList, setIndexList] = useState([]);
  const [checkbox, setCheckbox] = useState([]);
  const [reportData, setReportData] = useState([]);
  const [reportTitle, setReportTitle] = useState('');
  const [indexName, setIndexName] = useState('');
  const [filterIndexName, setFilterIndexName] = useState('');
  const [filterColumnValue, setFilterColumnValue] = useState('');
  const [dataModal, setDataModal] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [hour, setHour] = useState(0);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [filteredTableData, setFilteredData] = useState([]);
  const [userData, setUserData] = useState({
    email: '',
    dbName: '',
    user_id: ''
  });

  // ############################################ get report data ########################################
  // const HandleConnectorChange = async (event) => {
  //   setOpenLoader(true);
  //   setIndexList([]);
  //   setIndexName("");
  //   let payload = { name: allReplace(event.target.value, { _: "-" }) };
  //   const response = await ApiServices(
  //     "POST",
  //     payload,
  //     ApiEndPoints.ElasticIndexList
  //   );
  //   if (response) {
  //     setIndexList(response);
  //   }
  //   setReportTitle("");
  //   setOpenLoader(false);
  // };

  const HandleConnectorChange = async (event) => {
    setOpenLoader(true);
    setIndexList([]);
    setIndexName('');

    const payload = { name: allReplace(event.target.value, { _: '-' }) };

    try {
      const response = await ApiServices(
        'POST',
        payload,
        ApiEndPoints.ElasticIndexList // Ensure this points to your Express API
      );

      // Assuming the response contains an array of index names
      if (response && Array.isArray(response)) {
        setIndexList(response);
      } else {
        console.error('Unexpected response structure:', response);
      }
    } catch (error) {
      console.error('Error fetching index list:', error);
    }

    setReportTitle('');
    setOpenLoader(false);
  };

  // ############################################ connector list  ########################################
  const connectorData = async (item) => {
    setOpenLoader(true);
    const payload = {
      headers: { 'Access-Control-Allow-Origin': '*' },
      info: { dbName: item }
    };
    const response = await ApiServices(
      'post',
      payload,
      ApiEndPoints.ConectoreList
    );
    setConnectorList(response);
    setOpenLoader(false);
  };
  // ############################################ data for report  ########################################
  function getAllKeys(data) {
    const keys = [];

    function collectKeys(obj, prefix = '') {
      if (Array.isArray(obj)) {
        obj.forEach((item, index) => {
          collectKeys(item, `${prefix}[${index}]`);
        });
      } else if (typeof obj === 'object' && obj !== null) {
        Object.keys(obj).forEach((key) => {
          const newPrefix = prefix ? `${prefix}.${key}` : key;
          collectKeys(obj[key], newPrefix);
        });
      } else {
        keys.push(prefix);
      }
    }

    collectKeys(data);
    return keys;
  }
  // ############################################ handek checkbox ########################################

  const handleCheckboxChange = (e) => {
    // const columnName = allReplace(e.target.value, { "_source.": "" });
    const columnName = e.target.value;

    if (e.target.checked) {
      setSelectedColumns((prevColumns) => [...prevColumns, columnName]);
    } else {
      setSelectedColumns((prevColumns) =>
        prevColumns.filter((item) => item !== columnName)
      );
    }
  };

  // ############################################ FilterData  ########################################

  const filterColumnChange = (e) => {
    setFilterIndexName(e.target.value);
  };

  const FilterData = async ({ clear }) => {
    const dateNow = new Date();
    const thirtyMinutesAgo = new Date(
      dateNow.getTime() - `${hour * 60 * 1000}`
    );
    const datetimeString = thirtyMinutesAgo.toISOString().slice(0, -1);
    setOpenLoader(true);
    setTableData([]);
    const search = { [filterIndexName]: filterColumnValue };

    let payload = {
      index: indexName,
      column: clear ? checkbox : [],
      curruntTime: dateNow.toISOString().slice(0, -1),
      lessTime: datetimeString
    };
    let payloadsearch = {
      index: indexName,
      column: checkbox,
      search,
      curruntTime: dateNow.toISOString(),
      lessTime: datetimeString
    };

    const response = await ApiServices(
      'post',
      filterColumnValue ? payloadsearch : payload,
      ApiEndPoints.SearchData
    );
    console.log('before filtering the columns response ', response);
    // toast(response.msg);
    setTableData(response.map(r => r._source));
    setOpenLoader(false);
    setCheckbox([]);
    setFilterColumnValue('');
  };
  // ############################################ post report data ########################################

  const createReport = async () => {
    setOpenLoader(true);
    const filteredData =
      tableData.length > 0 &&
      tableData.map((row) => {
        const newRow = {};

        selectedColumns.forEach((column) => {
          const columnParts = column.split('.');

          if (columnParts.length === 1) {
            newRow[column] = row[column];
          } else {
            const parentProp = columnParts[0];
            const childProp = columnParts[1];

            if (!newRow[parentProp]) {
              newRow[parentProp] = {};
            }

            newRow[parentProp][childProp] = row[parentProp][childProp];
          }
        });

        return newRow;
      });
    setFilteredData(filteredData);
    let payload = {
      info: {
        dbName: userData.dbName,
        report_id: reportId,
        user_id: userData.user_id,
        title: reportTitle,
        column: checkbox,
        headerName: checkbox
      },
      data: { data: filteredData, column: checkbox }
    };
    const response = await ApiServices(
      'post',
      payload,
      ApiEndPoints.AddReportData
    );
    toast(response.msg);
    GetReportData(reportId);
    setCheckbox([]);
    setReportTitle('');
    setOpenLoader(false);
    setTableData(filteredData);
  };
  // console.log("table data after filtering out the columns", tableData)
  const ImportCSVData = () => { };
  const onFileLoad = (data) => {
    setTableData(data);
    setDataModal(false);
  };

  const [keys, columns, hidecolumn] = useMemo(() => {
    var keys = tableData && Array.from(deepKeys(tableData[0]));
    var columns = tableData && Columns(keys);
    // keys.map((name) => ({
    //   accessorKey: name,
    //   header: name,

    //   Cell: ({ cell }) =>
    //     name == "Risk" || name == "severity" || name == "risk-level" ? (
    //       <Box
    //         component="span"
    //         sx={(theme) => ({
    //           backgroundColor:
    //             cell.getValue() == "High" || cell.getValue() == "high"
    //               ? theme.palette.error.dark
    //               : cell.getValue() == "low" || cell.getValue() == "Low"
    //               ? theme.palette.warning.dark
    //               : cell.getValue() == "Medium" || cell.getValue() == "medium"
    //               ? theme.palette.warning.dark
    //               : cell.getValue() == "critical" ||
    //                 cell.getValue() == "Critical"
    //               ? theme.palette.success.dark
    //               : "",
    //           borderRadius: "0.25rem",
    //           // color: "#fff",
    //           maxWidth: "9ch",
    //           p: "0.25rem",
    //         })}
    //       >
    //         {cell.getValue()?.toLocaleString?.("", {
    //           style: "currency",
    //           currency: "USD",
    //           minimumFractionDigits: 0,
    //           maximumFractionDigits: 0,
    //         })}
    //       </Box>
    //     ) : (
    //       cell.getValue()
    //     ),
    // }));

    const hidecolumn = keys && hidencolumn(keys);
    return [keys, columns, hidecolumn]
  }, [tableData])


  console.log(keys, columns, hidecolumn)

  useEffect(() => {
    let userObject = localStorage.getItem('authUser');
    var userInfo = userObject ? JSON.parse(userObject) : '';
    setUserData(() => ({
      email: userInfo.email,
      dbName: userInfo.dbName,
      user_id: userInfo._id
    }));
    connectorData(userInfo.dbName);
  }, []);

  useEffect(() => {
    postData();
  }, [checkbox]);
  const postData = () => {
    if (Array.isArray(tableData)) {
      // Check if tableData is an array
      const flatData = tableData.map((i) => flattenObj(i));
      const datafilter = checkbox.map((item) => getFields(flatData, item));
      setReportData(datafilter);
    } else {
      console.error('tableData is not an array:', tableData); // Log an error for debugging
    }
  };
  return (
    <div>

      <div className="dark-dashboard">
        <div className="gradient-overlay" />

        {/* Header Section */}
        <div className="dashboard-header">
          <div className="header-content">
            <h1 className="main-title">
              <i className="bx bx-chart" />
              Create Report
            </h1>
            <p className="header-description">
              Generate and customize reports from your data sources
            </p>
          </div>
        </div>

        {/* Connector Selection Card */}
        <div className="dark-card form-section">
          <form
            onSubmit={(e) => {
              e.preventDefault()
              FilterData({ clear: true })
            }}
            className="p-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Connector Select */}
              <div className="form-group">
                <label className="dark-label">Select Connector</label>
                <div className="dark-input-group">
                  <select
                    className="dark-input"
                    onChange={(e) => HandleConnectorChange(e)}
                  >
                    <option value="">No connector selected</option>
                    {connectorList?.map((item, index) => (
                      <option key={index} value={item.display_name}>
                        {index + 1 + "  "}
                        {formatCapilize(
                          allReplace(item.display_name, {
                            _: " ",
                            "-": " ",
                          })
                        )}
                      </option>
                    ))}
                  </select>
                  <i className="bx bx-chevron-down input-icon" />
                </div>
              </div>

              {/* Index Select */}
              <div className="form-group">
                <label className="dark-label">Select Index</label>
                <div className="dark-input-group">
                  <select
                    className="dark-input"
                    onChange={(e) => setIndexName(e.target.value)}
                  >
                    <option value="">No index selected</option>
                    {Array.isArray(indexList) && indexList.length > 0 ? (
                      indexList.map((i, index) => (
                        <option key={index} value={i}>
                          {i}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>
                        No indices available
                      </option>
                    )}
                  </select>
                  <i className="bx bx-table input-icon" />
                </div>
              </div>

              {/* Time Select */}
              <div className="form-group">
                <label className="dark-label">Select Time Range</label>
                <div className="dark-input-group">
                  <select
                    className="dark-input"
                    onChange={(e) => setHour(e.target.value)}
                  >
                    <option value="">Select Time</option>
                    {hourData?.map((i, index) => (
                      <option key={index} value={i.value}>
                        {i.lable}
                      </option>
                    ))}
                  </select>
                  <i className="bx bx-time input-icon" />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end">
                <button type="submit" className="dark-button">
                  <i className="bx bx-search" />
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Column Selection and Filtering */}
        {tableData.length > 0 && keys.length > 0 && (
          <div className="dark-card form-section mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
              {/* Column Selection */}
              <div className="column-selection">
                <h4 className="dark-label mb-4">Select Columns</h4>
                <div className="max-h-[500px] overflow-y-auto custom-scrollbar">
                  {keys?.map((i) => (
                    <div key={i} className="checkbox-wrapper mb-2">
                      <input
                        type="checkbox"
                        id={i}
                        value={i}
                        onChange={handleCheckboxChange}
                        className="hidden"
                      />
                      <label
                        htmlFor={i}
                        className="flex items-center cursor-pointer text-sky-100 hover:text-sky-200"
                      >
                        <span className="w-5 h-5 border-2 border-sky-400 rounded mr-3 flex items-center justify-center">
                          <i className="bx bx-check text-sky-400" />
                        </span>
                        {i}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Configuration */}
              <div className="report-config">
                <div className="space-y-6">
                  {/* Report Title Input */}
                  <div className="form-group">
                    <label className="dark-label">Report Title</label>
                    <div className="dark-input-group">
                      <input
                        type="text"
                        className="dark-input"
                        placeholder="Enter Report Title"
                        value={reportTitle}
                        onChange={(e) => setReportTitle(e.target.value)}
                      />
                      <i className="bx bx-edit input-icon" />
                    </div>
                  </div>

                  {/* Filter Column Select */}
                  <div className="form-group">
                    <label className="dark-label">Filter Column</label>
                    <div className="dark-input-group">
                      <select
                        className="dark-input"
                        onChange={filterColumnChange}
                      >
                        <option value="">Select Filter Column</option>
                        {keys?.map((i) => (
                          <option key={i} value={i}>
                            {i}
                          </option>
                        ))}
                      </select>
                      <i className="bx bx-filter input-icon" />
                    </div>
                  </div>

                  {/* Filter Value Input */}
                  <div className="form-group">
                    <label className="dark-label">Filter Value</label>
                    <div className="dark-input-group">
                      <input
                        type="text"
                        className="dark-input"
                        placeholder="Enter Filter Value"
                        value={filterColumnValue}
                        onChange={(e) => setFilterColumnValue(e.target.value)}
                      />
                      <i className="bx bx-search input-icon" />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => FilterData({ clear: true })}
                      className="dark-button"
                    >
                      <i className="bx bx-filter" />
                      Filter Data
                    </button>
                    <button
                      onClick={createReport}
                      className="dark-button"
                    >
                      <i className="bx bx-plus" />
                      Create Report
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Data Table */}
        {tableData.length > 0 && (
          <div className="dark-card mt-6">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sky-100 text-xl font-semibold">{indexName}</h3>
                <Dropdown
                  isOpen={btnprimary1}
                  toggle={() => setBtnprimary1(!btnprimary1)}
                >
                  <DropdownToggle tag="button" className="dark-button">
                    <Download />
                    Export
                  </DropdownToggle>
                  <DropdownMenu>
                    <ExportCSV data={tableData} title={indexName} />
                  </DropdownMenu>
                </Dropdown>
              </div>

              <MaterialTable
                data={tableData}
                columns={columns}
                hidecolumn={hidecolumn}
              />
            </div>
          </div>
        )}

        {/* Loading Backdrop */}
        <ModalLoading
          isOpen={openLoader}
          onClose={() => setOpenLoader(false)}
        />
      </div>
    </div>
    //     </div>
  )
};

export default CreateSubReport;
const hourData = [
  { lable: 'Last 5 min Data', value: 5 },
  { lable: 'Last 10 min Data', value: 10 },
  { lable: 'Last 30 min Data', value: 30 },
  { lable: 'Last 60 min Data', value: 60 },
  { lable: 'Last 5 hour Data', value: 300 },
  { lable: 'Last 12 hour Data', value: 600 },
  { lable: 'Last 1 day Data', value: 1200 },
  { lable: 'Last 5 day Data', value: 6000 },
  { lable: 'Last 10 day Data', value: 12000 },
  { lable: 'Last 30 day Data', value: 36000 }
];
