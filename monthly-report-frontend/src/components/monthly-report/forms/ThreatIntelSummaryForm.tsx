import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {
  addTISIOCInvestigation,
  addTISIOCMatchDetail,
  addTISRSN,
  removeTISIOCInvestigation,
  removeTISIOCMatchDetail,
  removeTISRSN,
  updateTISAdvisoryChartColor,
  updateTISAdvisoryChartData,
  updateTISChartColor,
  updateTISChartData,
  updateTISIOCInvestigation,
  updateTISIOCMatchDetail,
  updateTISIOCSweep,
  updateTISInvestigationSummary,
  updateTISRSN,
  updateTISRSNKey,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";

const ThreatIntelSummaryForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.threat_intel_summary
  );

  const dispatch = useAppDispatch();

  const handleIOCMatchDetailChange = (
    index: number,
    field: string,
    value: string
  ) => {
    dispatch(updateTISIOCMatchDetail({ index, field, value }));
  };

  const handleAddIOCMatchDetail = () => {
    dispatch(addTISIOCMatchDetail());
  };

  const handleRemoveIOCMatchDetail = (index: number) => {
    dispatch(removeTISIOCMatchDetail(index));
  };

  const handleIOCInvestigationChange = (
    index: number,
    field: string,
    value: string
  ) => {
    dispatch(updateTISIOCInvestigation({ index, field, value }));
  };

  const handleInvestigationSummaryChange = (
    index: number,
    field: string,
    value: string
  ) => {
    dispatch(updateTISInvestigationSummary({ index, field, value }));
  };

  const handleAddIOCInvestigation = () => {
    dispatch(addTISIOCInvestigation());
  };

  const handleRemoveIOCInvestigation = (index: number) => {
    dispatch(removeTISIOCInvestigation(index));
  };

  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateTISRSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addTISRSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeTISRSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateTISRSNKey(value));
  };

  const handleChartDataChange = (
    datasetIndex: number,
    dataIndex: number,
    value: number
  ) => {
    dispatch(updateTISChartData({ datasetIndex, dataIndex, value }));
  };

  const handleChartColorChange = (datasetIndex: number, color: string) => {
    dispatch(updateTISChartColor({ datasetIndex, color }));
  };
  const handleAdvisoryChartDataChange = (
    datasetIndex: number,
    dataIndex: number,
    value: number
  ) => {
    dispatch(updateTISAdvisoryChartData({ datasetIndex, dataIndex, value }));
  };

  const handleAdvisoryChartColorChange = (
    datasetIndex: number,
    color: string
  ) => {
    dispatch(updateTISAdvisoryChartColor({ datasetIndex, color }));
  };

  return (
    <Grid container xs={12} spacing={2} p={3}>
      <Grid container item xs={12}>
        <h3>Count of Advisory for entire Month</h3>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        {data.count_of_advisory_chart.datasets.map((dataset, datasetIndex) =>
          dataset.data.map((dataPoint, dataIndex) => (
            <Grid
              container
              item
              xs={12}
              spacing={2}
              key={`${datasetIndex}-${dataIndex}`}
            >
              <Grid item xs={6}>
                <TextField
                  label={`Data Point ${datasetIndex + 1}-${dataIndex + 1}`}
                  type="number"
                  variant="outlined"
                  value={dataPoint}
                  onChange={(e) =>
                    handleAdvisoryChartDataChange(
                      datasetIndex,
                      dataIndex,
                      parseInt(e.target.value)
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                {dataIndex === 0 && (
                  <MuiColorInput
                    label={`Color ${datasetIndex + 1}`}
                    value={dataset.backgroundColor}
                    onChange={(color) =>
                      handleAdvisoryChartColorChange(datasetIndex, color)
                    }
                    fullWidth
                  />
                )}
              </Grid>
            </Grid>
          ))
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <h3>Total IOC Sweep for the Month</h3>
        <TextField
          type="number"
          variant="outlined"
          value={data.total_ioc_sweep}
          onChange={(e) =>
            dispatch(updateTISIOCSweep(parseInt(e.target.value)))
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container item xs={12}>
        <h3>Indicators of Compromise (IOC) Chart</h3>
      </Grid>
      <Grid container item xs={12} spacing={2}>
        {data.ioc_chart.datasets.map((dataset, datasetIndex) =>
          dataset.data.map((dataPoint, dataIndex) => (
            <Grid
              container
              item
              xs={12}
              spacing={2}
              key={`${datasetIndex}-${dataIndex}`}
            >
              <Grid item xs={6}>
                <TextField
                  label={`Data Point ${datasetIndex + 1}-${dataIndex + 1}`}
                  type="number"
                  variant="outlined"
                  value={dataPoint}
                  onChange={(e) =>
                    handleChartDataChange(
                      datasetIndex,
                      dataIndex,
                      parseInt(e.target.value)
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                {dataIndex === 0 && (
                  <MuiColorInput
                    label={`Color ${datasetIndex + 1}`}
                    value={dataset.backgroundColor}
                    onChange={(color) =>
                      handleChartColorChange(datasetIndex, color)
                    }
                    fullWidth
                  />
                )}
              </Grid>
            </Grid>
          ))
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container item rowSpacing={2} xs={12}>
        <h3>IOC Match Details</h3>
        {data.ioc_match_details.data.map((i, j) => (
          <Grid container item xs={12} alignItems="center" spacing={2} key={j}>
            <Grid container item xs={11} spacing={2}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Advisory Name"
                  value={i.advisory_name}
                  onChange={(e) =>
                    handleIOCMatchDetailChange(
                      j,
                      "advisory_name",
                      e.target.value
                    )
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="IOC Type"
                  value={i.ioc_type}
                  onChange={(e) =>
                    handleIOCMatchDetailChange(j, "ioc_type", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Detail"
                  value={i.detail}
                  onChange={(e) =>
                    handleIOCMatchDetailChange(j, "detail", e.target.value)
                  }
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Endpoint Name/Email"
                  value={i.endpoint_name}
                  onChange={(e) =>
                    handleIOCMatchDetailChange(
                      j,
                      "endpoint_name",
                      e.target.value
                    )
                  }
                />
              </Grid>
            </Grid>
            <Grid item xs={1} justifyContent="center">
              <IconButton
                aria-label="delete"
                color="primary"
                onClick={() => handleRemoveIOCMatchDetail(j)}
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddIOCMatchDetail}
          >
            Add
          </Button>
        </Grid>
        <Grid item xs={12}>
          <Divider />
        </Grid>
        <Grid container item rowSpacing={2} xs={12}>
          <h3>Investigation Summary</h3>
          {data.ioc_investigation.data.map((k, l) => (
            <Grid
              container
              item
              xs={12}
              alignItems="center"
              spacing={2}
              key={l}
            >
              <Grid container item xs={11} spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Advisory Name"
                    value={k.advisory_name}
                    onChange={(e) =>
                      handleIOCInvestigationChange(
                        l,
                        "advisory_name",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="About Advisory"
                    value={k.about_advisory}
                    onChange={(e) =>
                      handleIOCInvestigationChange(
                        l,
                        "about_advisory",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Incident No."
                    value={k.investigation_summary.incident_no}
                    onChange={(e) =>
                      handleInvestigationSummaryChange(
                        l,
                        "incident_no",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Incident Overview"
                    value={k.investigation_summary.incident_overview}
                    onChange={(e) =>
                      handleInvestigationSummaryChange(
                        l,
                        "incident_overview",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Findings"
                    value={k.investigation_summary.findings}
                    onChange={(e) =>
                      handleInvestigationSummaryChange(
                        l,
                        "findings",
                        e.target.value
                      )
                    }
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Action Taken"
                    value={k.investigation_summary.action_taken}
                    onChange={(e) =>
                      handleInvestigationSummaryChange(
                        l,
                        "action_taken",
                        e.target.value
                      )
                    }
                  />
                </Grid>
              </Grid>
              <Grid item xs={1} justifyContent="center">
                <IconButton
                  aria-label="delete"
                  color="primary"
                  onClick={() => handleRemoveIOCInvestigation(l)}
                >
                  <ClearIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddIOCInvestigation}
            >
              Add
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <h3>Recommendations/Notes/Summary</h3>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="rsn-label">Recommendations/Notes/Summary</InputLabel>
          <Select
            labelId="rsn-label"
            id="demo-simple-select"
            value={data.rsn.key}
            onChange={(e) => handleRSNKeyChange(e.target.value)}
            label="Recommendations/Notes/Summary"
          >
            <MenuItem value="Recommendations">Recommendations</MenuItem>
            <MenuItem value="Notes">Notes</MenuItem>
            <MenuItem value="Summary">Summary</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {data.rsn.data.map((j, k) => (
        <Grid container item xs={12} alignItems="center" spacing={2} key={k}>
          <Grid item xs={10}>
            <TextField
              label="Recommendations/Notes/Summary"
              variant="outlined"
              value={j}
              rows={3}
              fullWidth
              multiline
              onChange={(e) => handleRSNChange(k, e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => handleRemoveRSN(k)}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleAddRSN}>
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default ThreatIntelSummaryForm;
