import { CloseOutlined } from "@mui/icons-material";
import { Fragment, useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { Button, Card, CardBody, CardTitle, Col, Input, Modal, ModalBody, ModalFooter, ModalHeader, Row, Table } from "reactstrap";

// Import Breadcrumb
import { Link } from "react-router-dom";
import { Breadcrumbsub } from "../../components/Common/Breadcrumb";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import {
	allReplace, formatCapilize,
	objectkey,
	uperCase,
} from "../ulit/commonFunction";

import ModalLoading from "../../components/ModalLoading";
import BreadcrumbWithTitle from "../../components/Common/BreadcrumbWithTitle";

const ConnectorListTwo = () => {
	const [openLoader, setOpenLoader] = useState(false);
	const [connectorList, setConnectorList] = useState([]);
	const [searchedVal, setSearchedVal] = useState("");
	const [selectedRowKeys, setSelectedRowKeys] = useState([]);
	const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
	const [selectedConnector, setSelectedConnector] = useState(null);
	const [connectorName, setConnectorName] = useState("");
	const [config, setConfig] = useState(true);
	const [configData, setConfigData] = useState({});
	const [schedulerData, setSchedulerData] = useState({
		connectorId: "",
		repeat: "monthly",
		minute: "0",
		hour: "0",
		weekDay: "0",
		monthDay: "1",
	});

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
		connectorData();
	}, []);

	//   ######################################## connector list  ##########################################
	const connectorData = async () => {
		setOpenLoader(true);
		const response = await ApiServices(
			"get",
			null,
			ApiEndPoints.ConnectorList
		);
		setConnectorList(response);
		setOpenLoader(false);
	};
	// ############################################## connector conig ######################################

	const ConnectorConfigDetail = async (item) => {
		// debugger
		setConfigData({});
		// const payload = { dbName: userData.dbName, connector_id: item };
		// const response = await ApiServices(
		//     "post",
		//     payload,
		//     ApiEndPoints.ConnectorConfigDetail
		// );
		var connectorConfigurationDetail = connectorList.find((record) => record._id == item)
		var jsonData = {
			info: { dbName: userData.dbName, connectorId: item },
			data: {
				config: connectorConfigurationDetail?.config?.properties,
				connectorBasePath: connectorConfigurationDetail?.display_name,
				connectorFileNameWithExtension: "inventry.py",
			},
		};
		// if (response.success) {
		setConfig(connectorConfigurationDetail.isConnectorScheduled);
		setConnectorName(jsonData.data.connectorBasePath);
		if (connectorConfigurationDetail.scheduleInfo) {
			const scheduleInfo = connectorConfigurationDetail.scheduleInfo
			setSchedulerData({
				connectorId: item,
				repeat: scheduleInfo.repeat,
				minute: scheduleInfo.minute,
				hour: scheduleInfo.hour,
				weekDay: scheduleInfo.day,
				monthDay: scheduleInfo.date
			})
			console.log(objectkey(jsonData.data.config).reduce((p, c) => {
				return {
					...p,
					[c]: scheduleInfo.config[c]
				}
			}, {}))
			setConfigData(objectkey(jsonData.data.config).reduce((p, c) => {
				return {
					...p,
					[c]: scheduleInfo.config[c]
				}
			}, {}))
		} else {
			setConfigData(objectkey(jsonData.data.config).reduce((p, c) => {
				return {
					...p,
					[c]: ''
				}
			}, {}));
		}
		//  }
	};

	// ############################################ scheduler repeat  ########################################

	const RunScheduler = async (isSchedule) => {
		setOpenLoader(!openLoader);

		let schedulConfig = objectkey(configData).map((i) => ({
			[i]: configData[i],
		}));
		let payload = {
			info: {
				dbName: userData.dbName,
				connectorId: selectedConnector._id, // Use the selected connector's ID
				isScheduled: JSON.parse(isSchedule),
			},

			data: {
				minute: schedulerData.minute,
				hour:
					schedulerData.repeat === "minute"
						? 0
						: schedulerData.hour,
				day:
					schedulerData.repeat === "hourly" ||
						schedulerData.repeat === "minute"
						? 0
						: schedulerData.weekDay,
				date:
					schedulerData.repeat === "hourly" ||
						schedulerData.repeat === "minute"
						? 0
						: schedulerData.monthDay,
				inventory: uperCase(connectorName),
				repeat: schedulerData.repeat,
				config: Object.assign({}, ...schedulConfig),
			},
		};
		let parameterSavePayload = {
			dbName: userData.dbName,
			connector_id: schedulerData.connectorId,
			config: configData,
		};
		const respons = await ApiServices(
			"post",
			payload,
			ApiEndPoints.ConnectorScheduler
		);
		// const parameterSave =
		//     isSchedule === "true" || true
		//         ? await ApiServices(
		//             "post",
		//             parameterSavePayload,
		//             ApiEndPoints.ConnectorParameterSave
		//         )
		//         : null;
		toast.success(respons.msg);
		connectorData()
		setScheduleModalVisible(false);
		setOpenLoader(false);
	};

	const runConnector = async () => {
		try {
			setOpenLoader(true)
			const respons = await ApiServices(
				"post",
				null,
				`${ApiEndPoints.Connector}/${selectedConnector._id}`
			);
		} catch (e) {
			console.log(e)
		} finally {
			setOpenLoader(false)
		}
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		configData[name] = value;
	};

	const handelChange = ({ event, name }) => {
		setSchedulerData((prev) => ({
			...prev,
			[name]: event,
		}));
	};
	const handleSchedule = (record) => {
		// debugger
		setSelectedConnector(record);
		ConnectorConfigDetail(record._id); // Fetch the configuration data for the selected connector
		setScheduleModalVisible(true);
	};
	const onSelectChange = (selectedRowKeys) => {
		console.log("selected row", selectedRowKeys)
		setSelectedRowKeys([]);
	}


	const columns = [
		{
			title: "#",
			dataIndex: "index",
			key: "index",
		},
		{
			title: "Connector Name",
			dataIndex: "connectorName",
			key: "connectorName"
		},
		{
			title: "Installed On",
			dataIndex: "created_at",
			key: "created_at",
		},
		{
			title: "Log File",
			dataIndex: "logFile",
			key: "logFile",
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status"
		},
		{
			title: "Actions",
			dataIndex: "actions",
			key: "actions",
		},
	];


	const data = useMemo(() => connectorList
		.filter(
			(x) =>
				!searchedVal.length ||
				x.display_name
					.toString()
					.toLowerCase()
					.includes(searchedVal.toString().toLowerCase()) ||
				x.created_at
					.toString()
					.toLowerCase()
					.includes(searchedVal.toString().toLowerCase())
		)
		.map((item, index) => {
			return {
				key: item._id,
				index: index + 1,
				connectorName: (
					<Link to={"/connector-log/" + item.display_name} state={{ display_name: item.display_name }}>
						{formatCapilize(allReplace(item.display_name, { _: " ", "-": " " }))}
					</Link>
				),
				created_at: item.created_at,
				logFile: (
					<Link to={"/connector-log/" + item.display_name} state={{ display_name: item.display_name }}>
						{formatCapilize(allReplace(item.display_name, { _: " ", "-": " " }))}
					</Link>
				),
				status: (
					<>
						{item?.isConnectorScheduled && item?.isConnectorScheduled === true
							? "Scheduled"
							: item?.isConnectorScheduled === false
								? "Stopped"
								: "Pending"}
					</>
				),
				actions: (
					<button onClick={() => handleSchedule(item)} type="button" className="btn noti-icon m-0 p-0">
						<i className="mdi mdi-calendar"></i>
					</button>
				)
			}
		})
		, [connectorList])



	return (
		<Fragment>
			<BreadcrumbWithTitle title="Connector List" />
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
												<button onClick={() => setSearchedVal("")} className="input-group-text">
													<CloseOutlined />
												</button>
												<input
													type="text"
													className="form-control"
													id="autoSizingInputGroup"
													placeholder="Search"
													value={searchedVal}
													onChange={(e) => setSearchedVal(e.target.value)}
												/>
											</div>
										}
									/>
								</div>
							</CardTitle>
							{connectorList.length > 0 ? (
								<Table
									className="dark-table-container"
								>
									<thead>
										<tr>
											{columns.map(c => {
												return (
													<th key={c.key}>{c.title}</th>
												)
											})}
										</tr>
									</thead>
									<tbody>
										{data.map(d => {
											return (
												<tr key={d.key}>
													{
														columns.map(c => {
															return (
																<td key={c.key}>{d[c.dataIndex]}</td>
															)
														})
													}
												</tr>
											)
										})}
									</tbody>
								</Table>
							) : (
								<p>No data available</p>
							)}
						</CardBody>
						<Modal
							isOpen={scheduleModalVisible}
							toggle={() => setScheduleModalVisible(false)}
							size="lg"
						>
							<ModalHeader>Schedule Connector</ModalHeader>
							<ModalBody>
								<form>
									<Row gutter={[16, 16]}>

										<SelectOption data={shedulerRepeat} value={schedulerData.repeat} name="repeat" handelChange={handelChange} />

										{schedulerData.repeat ?
											<>
												{schedulerData.repeat === 'monthly' && (
													<SelectOption data={monthData} value={schedulerData.monthDay} name="monthDay" handelChange={handelChange} />
												)}

												{schedulerData.repeat === 'weekly' && (
													<SelectOption data={weekData} value={schedulerData.weekDay} name="weekDay" handelChange={handelChange} />
												)}

												{schedulerData.repeat !== 'minute' && schedulerData.repeat !== 'hourly' && (
													<SelectOption data={hourData} value={schedulerData.hour} name="hour" handelChange={handelChange} />
												)}

												<SelectOption data={minuteData} value={schedulerData.minute} name="minute" handelChange={handelChange} />
											</> : null}
									</Row>
								</form>
								{objectkey(configData).length > 0 && (
									<Row gutter={[16, 16]}>
										<Col xl={12}>
											<Card>
												<CardBody>
													<Row gutter={[16, 16]}>
														{configData &&
															objectkey(configData).map((i, u) => (
																<Col md={6} key={i}>
																	<div className="form-floating mb-3 fullwidth">
																		<input
																			defaultValue={configData[i]}
																			name={i}
																			className="form-control"
																			id="floatingFirstnameInput"
																			placeholder="Enter Your First Name"
																			onChange={handleInputChange}
																		/>
																		<label htmlFor="floatingFirstnameInput" className="text-capitalize">{i}</label>
																	</div>
																</Col>
															))}
													</Row>
													<Row gutter={[16, 16]}>
														<Col md={6}>
															<div className="d-flex flex-row gap-2">
																<button
																	disabled={config}
																	onClick={() => {
																		RunScheduler(true);
																	}}
																	className="btn btn-primary w-md"
																>
																	Schedule Connector
																</button>
																<button
																	disabled={!config}
																	onClick={() => {
																		runConnector();
																	}}
																	className="btn btn-info w-md"
																>
																	Run Manually
																</button>
															</div>
														</Col>
														<Col md={6}>
															<div>
																<button
																	disabled={!config}
																	onClick={() => {
																		RunScheduler(false);
																	}}
																	className="btn btn-danger w-md"
																>
																	Stop Schedule
																</button>
															</div>
														</Col>
													</Row>
												</CardBody>
											</Card>
										</Col>
									</Row>
								)}
							</ModalBody>
							<ModalFooter>
								<Button color="primary" onClick={() => setScheduleModalVisible(false)}>Ok</Button>
							</ModalFooter>
						</Modal>
					</Card>
				</Col>
			</Row>
			<ModalLoading
				isOpen={openLoader}
				onClose={() => setOpenLoader(false)}
			/>
		</Fragment>
	);
};

export default ConnectorListTwo;

const SelectOption = ({ data, name, value, handelChange }) => {
	return (
		<Col md={6}>
			<div className="form-floating mb-3">
				<Input
					className="form-select text-capitalize"
					type="select"
					style={{ width: '100%' }}
					placeholder={`Select ${formatCapilize(name)}`}
					value={value}
					onChange={(event) => {
						handelChange({
							event: event.target.value,
							name: name,
						});
					}}
				>
					{data.map((item, index) => (
						<option
							className="text-capitalize"
							key={item.value || item} value={item.value || item}
						>
							{name === 'connector'
								? formatCapilize(allReplace(item.display_name, { _: ' ', '-': ' ' }))
								: name === 'weekDay'
									? formatCapilize(item.name)
									: item}
						</option>
					))}
				</Input>
				<label htmlFor="floatingSelectGrid">Select {name}</label>
			</div>
		</Col>
	);
};

const shedulerRepeat = ["monthly", "weekly", "daily", "hourly", "minute"];
const minuteData = [];
for (let i = 0; i <= 59; i++) {
	minuteData.push(i);
}
const monthData = [];
for (let i = 1; i <= 31; i++) {
	monthData.push(i);
}
const weekData = [
	{ value: "0", name: "Sunday" },
	{ value: "1", name: "Monday" },
	{ value: "2", name: "Tuesday" },
	{ value: "3", name: "Wednesday" },
	{ value: "4", name: "Thursday" },
	{ value: "5", name: "Friday" },
	{ value: "6", name: "Saturday" },
];
// for (let i = 1; i <= 7; i++) {
//   weekData.push(i);
// }

const hourData = [];
for (let i = 0; i <= 23; i++) {
	hourData.push(i);
}
