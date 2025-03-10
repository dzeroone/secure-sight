import { Fragment, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Col, Row } from "reactstrap";
import Breadcrumbs from "../../components/Common/Breadcrumb";
import ModalLoading from "../../components/ModalLoading";
import ApiEndPoints from "../../Network_call/ApiEndPoints";
import ApiServices from "../../Network_call/apiservices";
import {
	allReplace,
	formatCapilize,
	objectkey,
	uperCase,
} from "../ulit/commonFunction";
import ConnectorListTwo from "./new-table";

const ConnectorSchedule = () => {
	// document.title = "scheduler | trend micro unity";
	document.title = "scheduler | Secure Sight";
	const [openLoader, setOpenLoader] = useState(false);
	const [connectorList, setConnectorList] = useState([]);
	const [connectorName, setConnectorName] = useState("");
	const [config, setConfig] = useState(true);
	const [configData, setConfigData] = useState([]);
	const [schedulerData, setSchedulerData] = useState({
		connectorId: "",
		repeat: "",
		minute: "",
		hour: "",
		weekDay: "",
		monthDay: "",
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

	// ############################################ connector list  ########################################

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
	// ############################################ scheduler repeat  ########################################

	const ConnectorConfigDetail = async (item) => {
		setConfigData([]);
		const payload = { dbName: userData.dbName, connector_id: item };
		const response = await ApiServices(
			"post",
			payload,
			ApiEndPoints.ConnectorConfigDetail
		);
		var jsonData = {
			"info": {
				"dbName": "orion",
				"connectorId": "64cad3f39ce2f6d71691047c"
			},
			"data": {
				"config": {
					"api_key": {
						"type": "string",
						"isPathArg": "false",
						"position": "1"
					},
					"secret_key": {
						"type": "string",
						"isPathArg": "false",
						"position": "2"
					}
				},
				"connectorBasePath": "aws_inventory",
				"connectorFileNameWithExtension": "inventry.py"
			}
		}
		// if (response.success) {
		setConfig(false);
		setConfigData(jsonData.data.config);
		setConnectorName(jsonData.data.connectorBasePath);
		// }
	};

	// ############################################ scheduler repeat  ########################################

	const RunScheduler = async (isSchedule) => {
		setOpenLoader(!openLoader);
		let schedulConfig = objectkey(configData)?.map((i) => ({
			[i]: configData[i]?.value,
		}));

		let payload = {
			info: {
				dbName: userData.dbName,
				connectorId: schedulerData.connectorId,
				isScheduled: JSON.parse(isSchedule),
			},
			data: {
				minute: schedulerData.minute,
				hour: schedulerData.repeat === "minute" ? 0 : schedulerData.hour,
				day:
					schedulerData.repeat === "hourly" || schedulerData.repeat === "minute"
						? 0
						: schedulerData.weekDay,
				date:
					schedulerData.repeat === "hourly" || schedulerData.repeat === "minute"
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
		// 	isSchedule === "true" || true
		// 		? await ApiServices(
		// 			"post",
		// 			parameterSavePayload,
		// 			ApiEndPoints.ConnectorParameterSave
		// 		)
		// 		: null;
		setConfigData([]);
		setSchedulerData({
			connectorId: "",
			repeat: "",
			minute: "",
			hour: "",
			weekDay: "",
			monthDay: "",
		});
		toast(respons.msg, { autoClose: 2000 });
		setOpenLoader(false);
	};
	const handleInputChange = (e) => {
		const { name, value } = e.target;
		configData[name].value = value;
	};
	const handelChange = ({ event, name }) => {
		setSchedulerData((prev) => ({
			...prev,
			[name]: event,
		}));
	};

	return (
		<Fragment>
			<div className="page-content">
				<Breadcrumbs title="Schedule" breadcrumbItem="Connector" />
				<Row>
					<Col className="col-12 col-md-12">
						<ConnectorListTwo />
					</Col>
				</Row>
			</div>
			<ModalLoading
				isOpen={openLoader}
				onClose={() => setOpenLoader(false)}
			/>
		</Fragment>
	);
};

export default ConnectorSchedule;

const SelectOption = ({ data, name, handelChange }) => {
	return (
		<Fragment>
			<Col md={6}>
				<div className="form-floating mb-3">
					<select
						className="form-select"
						id="floatingSelectGrid"
						aria-label="Floating label select example"
						onChange={(e) => {
							handelChange({
								event: e.target.value,
								name: name,
							});
						}}
					>
						<option value="">Select {formatCapilize(name)}</option>
						{data.map((item, index) => (
							<>
								{name === "connector" ? (
									<option value={item.id}>
										{formatCapilize(
											allReplace(item.display_name, { _: " ", "-": " " })
										)}
									</option>
								) : name === "weekDay" ? (
									<option value={item.value}>
										{formatCapilize(item.name)}
									</option>
								) : (
									<option value={item}>{item}</option>
								)}{" "}
							</>
						))}
					</select>
					<label htmlFor="floatingSelectGrid">Select {name}</label>
				</div>
			</Col>
		</Fragment>
	);
};

const shedulerRepeat = ["monthly", "weekly", "daily", "hourly", "minute"];
const minuteData = [];
for (let i = 1; i <= 59; i++) {
	minuteData.push(i);
}
const monthData = [];
for (let i = 1; i <= 31; i++) {
	monthData.push(i);
}
const weekData = [
	{ value: "0", name: "sunday" },
	{ value: "1", name: "monday" },
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
for (let i = 1; i <= 23; i++) {
	hourData.push(i);
}
