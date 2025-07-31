import { Fragment, useCallback, useEffect, useState } from "react";
import Dropzone from "react-dropzone";
import {
	Card,
	CardBody,
	Col,
	Container,
	Dropdown,
	DropdownItem,
	DropdownMenu,
	DropdownToggle,
	Form,
	Input,
	Row
} from "reactstrap";

// Breadcrumb
import Breadcrumbs from "../../../components/Common/Breadcrumb";

import axios from "axios";
import JSZip from "jszip";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ApiEndPoints from "../../../Network_call/ApiEndPoints";
import ApiServices from "../../../Network_call/apiservices";
import ConnectorList from "../connectorList";
import ModalLoading from "../../../components/ModalLoading";
import { ArchiveIcon } from "lucide-react";
import BreadcrumbWithTitle from "../../../components/Common/BreadcrumbWithTitle";
import timezones from "timezones.json"



const chunkSize = 10000 * 1000;
const ConnectorUploader = () => {
	const [selectedFiles, setSelectedFiles] = useState([]);
	const [connectorData, setConnectorData] = useState([]);
	const [refreshSeed, setRefreshSeed] = useState(0);

	const [openLoader, setOpenLoader] = useState(false);
	const [dropdownOpen, setDropdownOpen] = useState(false);
	const [selectedTimezone, setSelectedTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
	const [state, setState] = useState({
		currentFile: undefined,
		previewImage: undefined,
		uploadFiles: false,
		progress: 0,
		message: "",
		imageInfos: [],
		files: [],
		multiConnectorInfo: [],
		dbData: [],
		btnLoader: false,
		currentFileIndex: null,
		lastUploadedFileIndex: null,
		currentChunkIndex: null,
		selectedFileInfo: null,
		calculatePercentage: 0,
		totalHit: 0,
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
	}, []);

	const info = { email: userData.email, dbName: userData.dbName };

	const handleAcceptedFiles = async (files) => {
		files.map((file) =>
			Object.assign(file, {
				preview: URL.createObjectURL(file),
				formattedSize: formatBytes(file.size),
			})
		);
		setSelectedFiles(files);
		let multiConnectorInfo = [];
		for (let file of files) {
			try {
				const fileContent = await JSZip.loadAsync(file)
				let text = '';
				// console.log(fileContent.files)
				// system needs the integration.json file in the root directory, for here we are filtering only root dir files
				const onlyRootFiles = fileContent.filter((rPath, file) => {
					if (file.name.includes('/')) return false
					if (file.name.lastIndexOf('.') < 0) return false
					return true
				})
				for (let file of onlyRootFiles) {
					if (file.name.includes("integration.json"))
						text = await file.async("text");
				}
				const ctorData = JSON.parse(text);
				setConnectorData([ctorData]);

				multiConnectorInfo = [...multiConnectorInfo, ctorData];
			} catch (err) {
				console.log(err)
				setState((prevState) => ({
					...prevState,
					multiConnectorInfo: [],
				}));
				setConnectorData([]);

				return;
			}
		}
		setState((prevState) => ({
			...prevState,
			multiConnectorInfo,
			files,
		}));
	};

	function formatBytes(bytes, decimals = 2) {
		if (bytes === 0) return "0 Bytes";
		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
	}

	const onSubmit = async () => {
		setOpenLoader(true);
		setState(s => ({
			...s,
			uploadFiles: true
		}))
	};

	const refreshConnectorList = () => {
		setRefreshSeed(Math.random())
	}

	const startUploadingConnector = useCallback(async () => {
		if (state.uploadFiles) {
			if (state.currentFileIndex !== null) {
				const payload = {
					info: { email: userData.email, dbName: userData.dbName, timezone: selectedTimezone },
					data: [state.multiConnectorInfo[state.currentFileIndex]],
				};
				const response = await ApiServices(
					"post",
					payload,
					ApiEndPoints.InsertMultiConnector
				);
				if (!response.error) {
					setState((prevState) => ({
						...prevState,
						btnLoader: true,
						selectedFileInfo: state.files[state.currentFileIndex],
						dbData: response.data
					}));
					if (state.currentFileIndex !== null) {
						setState((prevState) => ({ ...prevState, currentChunkIndex: 0 }));
					}
					return
				}
			}
		}
	}, [state.uploadFiles, state.currentFileIndex, userData])

	useEffect(() => {
		startUploadingConnector();
	}, [startUploadingConnector])

	useEffect(() => {
		if (state.lastUploadedFileIndex === null) {
			return;
		}
		const isLastFile = state.lastUploadedFileIndex === state.files.length - 1;
		if (isLastFile) {
			setSelectedFiles([]);
			setConnectorData([]);
			refreshConnectorList();
		}
		setState((prevState) => ({
			...prevState,
			uploadFiles: isLastFile ? false : prevState.uploadFiles,
			currentFileIndex: isLastFile ? null : prevState.currentFileIndex + 1,
		}));
	}, [state.lastUploadedFileIndex]);

	useEffect(() => {
		if (state.files.length > 0) {
			setState((prevState) => ({
				...prevState,
				lastUploadedFileIndex: null,
				currentFileIndex: 0
			}));
		}
	}, [state.files]);

	useEffect(() => {
		if (state.currentChunkIndex !== null) {
			readAndUploadCurrentChunk();
		}
	}, [state.currentChunkIndex]);

	function readAndUploadCurrentChunk() {
		const reader = new FileReader();
		const file = state.files[state.currentFileIndex];
		if (!file) {
			return;
		}
		const from = state.currentChunkIndex * chunkSize;
		const to = from + chunkSize;
		const blob = file.slice(from, to);
		reader.onload = (e) => uploadChunk(e);
		reader.readAsDataURL(blob);
	}

	const uploadChunk = async (readerEvent) => {
		setOpenLoader(true);
		const file = state.files[state.currentFileIndex];
		const data = readerEvent.target.result;
		const params = new URLSearchParams();
		params.set("name", file.name);
		params.set("size", file.size);
		params.set("currentChunkIndex", state.currentChunkIndex);
		params.set("totalChunks", Math.ceil(file.size / chunkSize));
		params.set("email", info.email);
		params.set("dbName", info.dbName);

		let selectedConnecter = state.multiConnectorInfo[state.currentFileIndex];
		params.set("display_name", selectedConnecter.display_name);
		params.set("category", selectedConnecter.category);
		params.set("nameWithoutExtension", selectedConnecter.name);
		params.set("connectorId", state.dbData[state.currentFileIndex]._id);

		const headers = { "Content-Type": "application/octet-stream" };

		const response = await axios
			.post(`${ApiEndPoints.UploadConnector}${params}`, data, {
				headers,
			})
			.then((res) => res);
		const respFile = state.files[state.currentFileIndex];
		const filesize = state.files[state.currentFileIndex].size;
		const chunks = Math.ceil(filesize / chunkSize) - 1;
		const isLastChunk = state.currentChunkIndex === chunks;

		if (isLastChunk) {
			// respFile.finalFilename = response.finalFilename;
			respFile.tempFilename = response.tmpFilename
			setState((prevState) => ({
				...prevState,
				btnLoader: false,
				lastUploadedFileIndex: state.currentFileIndex,
				currentChunkIndex: null,
				// calculatePercentage: calculatePercentageFn(),
				totalHit: prevState.totalHit + 1,
			}));
			setOpenLoader(false);
			toast.success("Connector has been added!");
		} else {
			setState((prevState) => ({
				...prevState,
				currentChunkIndex: state.currentChunkIndex + 1,
				// calculatePercentage: calculatePercentageFn(),
				totalHit: prevState.totalHit + 1,
			}));
		}
	};

	const toggleDropdown = () => {
		setDropdownOpen(!dropdownOpen);
	};

	const handleTimezoneChange = (v) => {
		setSelectedTimezone(v);
	};


	return (
		<Fragment>
			<div className="page-content">
				<Container fluid={true}>
					<BreadcrumbWithTitle title="Connector upload" />
					<Row>
						<Col className="col-12 col-md-8">
							<Card>
								<CardBody>
									<Form className="dropzone">
										<Dropzone
											onDrop={(acceptedFiles) => {
												handleAcceptedFiles(acceptedFiles);
											}}
											style={{ width: "700px !important" }}
										>
											{({ getRootProps, getInputProps }) => (
												<div style={{ textAlign: "center" }}>
													<div
														className="dz-message needsclick"
														{...getRootProps()}
													>
														<input {...getInputProps()} />
														<div className="mb-3">
															<i className="display-4 text-muted mdi mdi-cloud-upload-outline"></i>
														</div>
														<h4>Drop files here to upload</h4>
													</div>
												</div>
											)}
										</Dropzone>
										<div className="dropzone-previews mt-3" id="file-previews">
											{selectedFiles.map((f, i) => {
												return (
													<Card
														className="mt-1 mb-0 shadow-none border dz-processing dz-image-preview dz-success dz-complete"
														key={i + "-file"}
													>
														<div className="p-2">
															<Row className="align-items-center">
																<Col className="col-auto">
																	<ArchiveIcon />
																	{/* <img
																		data-dz-thumbnail=""
																		height="80"
																		className="avatar-sm rounded bg-dark"
																		alt={f.name}
																		src={f.preview}
																	/> */}
																</Col>
																<Col>
																	<div
																		className="text-muted font-weight-bold"
																	>
																		{f.name}
																	</div>
																	<p className="mb-0">
																		<strong>{f.formattedSize}</strong>
																	</p>
																</Col>
															</Row>
														</div>
													</Card>
												);
											})}
										</div>
									</Form>
								</CardBody>
							</Card>
						</Col>
						<Col className="col-12 col-md-3">
							<div className="mb-3">
								<Input
									type="select"
									value={selectedTimezone}
									onChange={(e) => {
										handleTimezoneChange(e.target.value)
									}}
								>
									{timezones.map((timezone, i) => {
										return (
											<option value={timezone.utc[0]} key={i}>{timezone.text}</option>
										)
									})}
								</Input>
							</div>
							<div className="d-line-block">
								<button
									type="button"
									disabled={!connectorData.length > 0}
									onClick={onSubmit}
									className="btn btn-primary "
								>
									Upload Connector
								</button>
							</div>
						</Col>
					</Row>
					<Row>
						<Col className="col-12 col-md-12">
							<ConnectorList key={refreshSeed} />
						</Col>
					</Row>
				</Container>
			</div>
			<ModalLoading
				isOpen={openLoader}
				persistent={true}
				onClose={() => {
					setOpenLoader(false)
				}}
			/>
		</Fragment >
	);
};

export default ConnectorUploader;









// src/FileDrop.js
// import React from 'react';
// import { useDropzone } from 'react-dropzone';

// const ConnectorUploader = () => {
//     const onDrop = (acceptedFiles) => {
//         const pythonFile = acceptedFiles.find(file => file.type === "text/x-python" || file.name.endsWith('.py'));

//         if (pythonFile) {
//             const formData = new FormData();
//             formData.append('file', pythonFile);

//             // Send the file to the backend
//             fetch('http://localhost:5001/api/upload', { // Make sure this matches your backend endpoint
//                 method: 'POST',
//                 body: formData,
//             })
//                 .then(response => response.json())
//                 .then(data => {
//                     console.log('Success:', data);
//                     alert(data.output || "Script executed successfully.");
//                 })
//                 .catch((error) => {
//                     console.error('Error:', error);
//                     alert('Error executing script.');
//                 });
//         } else {
//             alert('Please drop a valid Python file (.py)');
//         }
//     };

//     const { getRootProps, getInputProps } = useDropzone({ onDrop });

//     return (
//         <div {...getRootProps({ className: 'dropzone' })} style={{ width: '400px', height: '200px', border: '2px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
//             <input {...getInputProps()} />
//             <p>Drag and drop your Python script here, or click to select one</p>
//         </div>
//     );
// };

// export default ConnectorUploader;


