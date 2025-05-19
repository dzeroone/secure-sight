import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store/store";
import {
  setAlcKey,
  addAlcData,
  updateAlcData,
  removeAlcData,
  addEndpointData,
  editEndpointData,
  removeEndpointData,
  updateApexOneData,
  updateWorkloadSecurityData,
  ApexOneState,
  WorkloadSecurityState,
} from "../../features/weekly/weeklySlice";
import { MdClose, MdEdit } from "react-icons/md";
import Label from "./Label";
import { TextAreaInput, TextInput } from "./Inputs";
import RecommendationInput from "./RecommendationInput";

const AlcForm = () => {
  const dispatch = useDispatch();
  const alc = useSelector((state: RootState) => state.alc);
  const { endpointData } = useSelector((state: RootState) => state.endpoint);
  const recommendations = useSelector(
    (s: RootState) => s.recommendation.agentLifeCycle
  );

  const handleAlcKeyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    dispatch(
      setAlcKey(event.target.value as "Recommendations" | "Notes" | "Summary")
    );
  };

  const handleAlcChange = (index: number, value: string) => {
    dispatch(updateAlcData({ index, text: value }));
  };

  const handleAddAlc = () => {
    dispatch(addAlcData(""));
  };

  const handleRemoveAlc = (index: number) => {
    dispatch(removeAlcData(index));
  };

  const [endpointName, setEndpointName] = useState("");
  const [detectionsWithSeverity, setDetectionsWithSeverity] = useState("");
  const [actionTakenBySoc, setActionTakenBySoc] = useState("The SOC team is actively developing and testing observed attack methods on the specified endpoint, while also prioritizing their efforts to respond to and communicate with the client.");
  const [editIndex, setEditIndex] = useState<number | null>(null);

  const handleAddOrEditEndpoint = () => {
    if (endpointName && detectionsWithSeverity) {
      if (editIndex !== null) {
        dispatch(
          editEndpointData({
            index: editIndex,
            updatedData: {
              endpointName,
              detectionsWithSeverity,
              actionTakenBySoc,
            },
          })
        );
        setEditIndex(null);
      } else {
        dispatch(
          addEndpointData({
            endpointName,
            detectionsWithSeverity,
            actionTakenBySoc,
          })
        );
      }
      setEndpointName("");
      setDetectionsWithSeverity("");
    }
  };

  const handleEditClick = (index: number) => {
    const endpoint = endpointData[index];
    setEndpointName(endpoint.endpointName);
    setDetectionsWithSeverity(endpoint.detectionsWithSeverity);
    setEditIndex(index);
  };

  const handleRemoveClick = (index: number) => {
    dispatch(removeEndpointData(index));
  };

  const apexOne = useSelector((state: RootState) => state.apexOne);
  const workloadSecurity = useSelector(
    (state: RootState) => state.workloadSecurity
  );

  const handleApexOneChange = (field: keyof ApexOneState, value: any) => {
    let updatedData = { ...apexOne };
    // @ts-ignore
    updatedData[field] = value;
    dispatch(updateApexOneData(updatedData));
  };

  const handleWorkloadSecurityChange = (
    field: keyof WorkloadSecurityState,
    value: any
  ) => {
    let updatedData = { ...workloadSecurity };
    // @ts-ignore
    updatedData[field] = value;
    dispatch(updateWorkloadSecurityData(updatedData));
  };

  return (
    <div className="p-6 bg-white rounded-lg border shadow-md">
      <h3 className="text-lg font-semibold mb-4">Agent Life Cycle Form</h3>
      <div className="mb-4">
        <RecommendationInput entity="agentLifeCycle" values={recommendations} />
      </div>
      <div>
        <div className="my-4">
          <h3 className="text-lg font-semibold mb-1">Apex One Chart</h3>
          <div className="flex flex-col gap-2">
            <div>
              <Label>Title</Label>
              <TextInput
                placeholder="Title"
                value={apexOne.title}
                onChange={(e) => handleApexOneChange("title", e.target.value)}
              />
            </div>
            <div>
              <Label>All version</Label>
              <TextInput
                placeholder="All version"
                type="number"
                value={apexOne.allV}
                onChange={(e) =>
                  handleApexOneChange("allV", Number(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label>Latest version</Label>
              <TextInput
                placeholder="Latest Version"
                value={apexOne.latestVersion}
                onChange={(e) =>
                  handleApexOneChange(
                    "latestVersion",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <Label>Older version</Label>
              <TextInput
                placeholder="Older version"
                value={apexOne.olderVersion}
                onChange={(e) =>
                  handleApexOneChange(
                    "olderVersion",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <Label>Not supported OS</Label>
              <TextInput
                placeholder="Not supported OS"
                value={apexOne.nsOS}
                onChange={(e) =>
                  handleApexOneChange("nsOS", Number(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label>OS agent incompatible</Label>
              <TextInput
                placeholder="OS agent incompatible"
                value={apexOne.osInc}
                onChange={(e) =>
                  handleApexOneChange("osInc", Number(e.target.value) || 0)
                }
              />
            </div>
            <div>
              <Label>End of Life</Label>
              <TextInput
                placeholder="End of Life"
                value={apexOne.endOfLife}
                onChange={(e) =>
                  handleApexOneChange("endOfLife", Number(e.target.value) || 0)
                }
              />
            </div>
          </div>
        </div>

        {/* Workload Security Chart Section */}
        <div className="my-4">
          <h3 className="text-lg font-semibold mb-1">
            Workload Security Chart
          </h3>
          <div className="flex flex-col gap-2">
            <div>
              <Label>Title</Label>
              <TextInput
                placeholder="Title"
                value={workloadSecurity.title}
                onChange={(e) =>
                  handleWorkloadSecurityChange("title", e.target.value)
                }
              />
            </div>
            <div>
              <Label>All version</Label>
              <TextInput
                placeholder="All version"
                type="number"
                value={workloadSecurity.allV}
                onChange={(e) =>
                  handleWorkloadSecurityChange(
                    "allV",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <Label>Latest version</Label>
              <TextInput
                placeholder="Latest Version"
                value={workloadSecurity.latestVersion}
                onChange={(e) =>
                  handleWorkloadSecurityChange(
                    "latestVersion",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <Label>Older version</Label>
              <TextInput
                placeholder="Older version"
                value={workloadSecurity.olderVersion}
                onChange={(e) =>
                  handleWorkloadSecurityChange(
                    "olderVersion",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <Label>Not supported OS</Label>
              <TextInput
                placeholder="Not supported OS"
                value={workloadSecurity.nsOS}
                onChange={(e) =>
                  handleWorkloadSecurityChange(
                    "nsOS",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <Label>OS agent incompatible</Label>
              <TextInput
                placeholder="OS agent incompatible"
                value={workloadSecurity.osInc}
                onChange={(e) =>
                  handleWorkloadSecurityChange(
                    "osInc",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
            <div>
              <Label>End of Life</Label>
              <TextInput
                placeholder="End of Life"
                value={workloadSecurity.endOfLife}
                onChange={(e) =>
                  handleWorkloadSecurityChange(
                    "endOfLife",
                    Number(e.target.value) || 0
                  )
                }
              />
            </div>
          </div>
        </div>

        {/* Endpoint Section */}
        <div className="my-4">
          <h3 className="text-lg font-semibold mb-1">
            Top 5 Endpoint with Highest Observed Attack Technique
          </h3>
          <div className="mt-2">
            {endpointData.map((endpoint, index) => (
              <div key={index} className="flex items-center mb-4">
                <div className="flex-1">
                  <p>
                    <strong>Endpoint:</strong> {endpoint.endpointName}
                  </p>
                  <p>
                    <strong>Detections with Severity:</strong>{" "}
                    {endpoint.detectionsWithSeverity}
                  </p>
                  <p>
                    <strong>Action Taken by SOC:</strong>{" "}
                    {endpoint.actionTakenBySoc}
                  </p>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={() => handleEditClick(index)}
                    className="p-2 bg-[#0d9488] text-white rounded-md focus:outline-none"
                  >
                    <MdEdit size={20} />
                  </button>
                  <button
                    onClick={() => handleRemoveClick(index)}
                    className="ml-2 p-2 bg-[#ef4444] text-white rounded-md focus:outline-none"
                  >
                    <MdClose size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="mb-4">
            <Label>
              Endpoint Name
            </Label>
            <TextInput
              id="endpoint-name"
              type="text"
              value={endpointName}
              onChange={(e) => setEndpointName(e.target.value)}
              placeholder="Enter endpoint name"
            />
          </div>
          <div className="mb-4">
            <Label>
              Detections with Severity
            </Label>
            <TextInput
              id="detections-with-severity"
              type="text"
              value={detectionsWithSeverity}
              onChange={(e) => setDetectionsWithSeverity(e.target.value)}
              placeholder="Enter detections with severity"
            />
          </div>

          <div className="mb-4">
            <Label>
              Action Taken by SOC
            </Label>
            <TextAreaInput
              id="action-taken-by-soc"
              value={actionTakenBySoc}
              onChange={(e) => setActionTakenBySoc(e.target.value)}
              placeholder="Enter action taken by SOC"
            />
          </div>

          <button
            onClick={handleAddOrEditEndpoint}
            className="w-full px-4 py-2 bg-[#2f3848] text-white rounded-md focus:outline-none"
          >
            {editIndex !== null ? "Update Endpoint" : "Add Endpoint"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlcForm;
