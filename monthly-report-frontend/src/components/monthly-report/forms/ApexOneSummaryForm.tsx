import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Button, Checkbox, Divider, FormControlLabel, FormGroup, Grid, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { MuiColorInput } from "mui-color-input";
import {
  addDSAOTableEntry,
  removeDSAOTableEntry,
  updateDSAOChart,
  updateDSAOChartColor,
  updateDSAOChartLabel,
  updateDSAOTableEntry,
  updateDSAOVisibility,
} from "@@/lib/features/monthly-report/monthlySlice";

const ApexOneSummaryForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.detection_summary_apex_one
  );

  const dispatch = useAppDispatch();

  const handleAddTableEntry = (table: "table1" | "table2") => {
    dispatch(addDSAOTableEntry(table));
  };

  const handleRemoveTableEntry = (
    table: "table1" | "table2",
    index: number
  ) => {
    dispatch(removeDSAOTableEntry({ table, index }));
  };

  const handleUpdateTableEntry = (
    table: "table1" | "table2",
    index: number,
    fieldPath: string,
    value: string
  ) => {
    console.log("Updating table entry with fieldPath:", fieldPath); // Debug log
    if (!fieldPath) {
      console.error("fieldPath is undefined", { table, index, value });
      return; // Prevent execution if fieldPath is undefined
    }
    dispatch(updateDSAOTableEntry({ table, index, fieldPath, value }));
  };

  const handleUpdateChartLabel = (
    chart: "detection_chart" | "attempts_blocked_chart",
    index: number,
    label: string
  ) => {
    dispatch(updateDSAOChartLabel({ chart, index, label }));
  };

  const handleUpdateChartData = (
    chart: "detection_chart" | "attempts_blocked_chart",
    index: number,
    value: string
  ) => {
    const numericValue = parseInt(value, 10);
    dispatch(updateDSAOChart({ chart, index, value: numericValue }));
  };

  const handleVisibilityChange = (value: boolean) => {
    dispatch(updateDSAOVisibility(value));
  };

  const handleUpdateChartColor = (
    chart: "detection_chart" | "attempts_blocked_chart",
    color: string
  ) => {
    dispatch(updateDSAOChartColor({ chart, color }));
  };

  return (
    <Grid container spacing={3} p={3}>
      {/* Virus / Malware and Spyware / Grayware Chart */}
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.visible}
                  onChange={(e) => handleVisibilityChange(e.target.checked)}
                />
              }
              label="Show/Hide"
            />
          </FormGroup>
        </Grid>
        <Grid item xs={12}>
          <h3>Virus / Malware and Spyware / Grayware</h3>
          <Divider />
        </Grid>
        {data.detection_chart.key.map((key, index) => (
          <Grid container item xs={12} spacing={2} key={index}>
            <Grid item xs={6}>
              <TextField
                label={`Chart Label ${index + 1}`}
                variant="outlined"
                value={key}
                onChange={(e) =>
                  handleUpdateChartLabel(
                    "detection_chart",
                    index,
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`Data ${index + 1}`}
                variant="outlined"
                value={data.detection_chart.datasets[0].data[index]}
                onChange={(e) =>
                  handleUpdateChartData(
                    "detection_chart",
                    index,
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <MuiColorInput
            label="Chart Color"
            value={data.detection_chart.datasets[0].backgroundColor}
            onChange={(color) =>
              handleUpdateChartColor("detection_chart", color)
            }
            fullWidth
          />
        </Grid>
      </Grid>
      <Divider />

      {/* C & C Connections and Intrusion attempts Blocked Chart */}
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <h3>C & C Connections and Intrusion attempts Blocked</h3>
          <Divider />
        </Grid>
        {data.attempts_blocked_chart.key.map((key, index) => (
          <Grid container item xs={12} spacing={2} key={index}>
            <Grid item xs={6}>
              <TextField
                label={`Chart Label ${index + 1}`}
                variant="outlined"
                value={key}
                onChange={(e) =>
                  handleUpdateChartLabel(
                    "attempts_blocked_chart",
                    index,
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`Data ${index + 1}`}
                variant="outlined"
                value={data.attempts_blocked_chart.datasets[0].data[index]}
                onChange={(e) =>
                  handleUpdateChartData(
                    "attempts_blocked_chart",
                    index,
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <MuiColorInput
            label="Chart Color"
            value={data.attempts_blocked_chart.datasets[0].backgroundColor}
            onChange={(color) =>
              handleUpdateChartColor("attempts_blocked_chart", color)
            }
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      {/* Table 1 for Files Actions */}
      <Grid item xs={12}>
        <h3>Top Endpoints Actions</h3>
        <Grid container spacing={2}>
          {data.tables.table1.map((item, index) => (
            <Grid item xs={12}>
              <Grid
                container
                spacing={2}
                key={index}
                alignItems="center"
              >
                <Grid item xs={11}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <TextField
                        label="File Cleaned"
                        variant="outlined"
                        value={item.file_cleaned || ""}
                        onChange={(e) =>
                          handleUpdateTableEntry(
                            "table1",
                            index,
                            "file_cleaned",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Count"
                        variant="outlined"
                        type="number"
                        value={
                          item.fc_v ? item.fc_v : 0
                        }
                        onChange={(e) =>
                          handleUpdateTableEntry(
                            "table1",
                            index,
                            "fc_v",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="File Quarantined"
                        variant="outlined"
                        value={item.file_quarantined || ""}
                        onChange={(e) =>
                          handleUpdateTableEntry(
                            "table1",
                            index,
                            "file_quarantined",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Count"
                        variant="outlined"
                        type="number"
                        value={
                          item.fq_v ? item.fq_v : 0
                        }
                        onChange={(e) =>
                          handleUpdateTableEntry(
                            "table1",
                            index,
                            "fq_v",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="File Deleted"
                        variant="outlined"
                        value={item.file_deleted || ""}
                        onChange={(e) =>
                          handleUpdateTableEntry(
                            "table1",
                            index,
                            "file_deleted",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        label="Count"
                        variant="outlined"
                        type="number"
                        value={
                          item.fd_v ? item.fd_v : 0
                        }
                        onChange={(e) =>
                          handleUpdateTableEntry(
                            "table1",
                            index,
                            "fd_v",
                            e.target.value
                          )
                        }
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={1}>
                  <IconButton
                    aria-label="delete"
                    color="primary"
                    onClick={() => handleRemoveTableEntry("table1", index)}
                  >
                    <ClearIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item xs={12}>
            <Button
              onClick={() => handleAddTableEntry("table1")}
              color="primary"
              variant="contained"
            >
              Add Endpoint
            </Button>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      {/* Table 2 for Blocked Attempts */}
      <Grid container item xs={12} spacing={2}>
        <h3>Blocked Connection Attempts</h3>
        {data.tables.table2.map((item, index) => (
          <Grid
            container
            item
            xs={12}
            spacing={2}
            key={index}
            alignItems="center"
          >
            <Grid container item xs={11} spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Intrusion Endpoint"
                  variant="outlined"
                  value={
                    item.attempts_blocked ? item.attempts_blocked.endpoint : ""
                  }
                  onChange={(e) =>
                    handleUpdateTableEntry(
                      "table2",
                      index,
                      "attempts_blocked.endpoint",
                      e.target.value
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Intrusions Blocked"
                  variant="outlined"
                  type="number"
                  value={
                    item.attempts_blocked ? item.attempts_blocked.blocked : 0
                  }
                  onChange={(e) =>
                    handleUpdateTableEntry(
                      "table2",
                      index,
                      "attempts_blocked.blocked",
                      e.target.value
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Connection Endpoint"
                  variant="outlined"
                  value={
                    item.connection_endpoint
                      ? item.connection_endpoint.endpoint
                      : ""
                  }
                  onChange={(e) =>
                    handleUpdateTableEntry(
                      "table2",
                      index,
                      "connection_endpoint.endpoint",
                      e.target.value
                    )
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Connections Blocked"
                  variant="outlined"
                  type="number"
                  value={
                    item.connection_endpoint
                      ? item.connection_endpoint.blocked
                      : 0
                  }
                  onChange={(e) =>
                    handleUpdateTableEntry(
                      "table2",
                      index,
                      "connection_endpoint.blocked",
                      e.target.value
                    )
                  }
                  fullWidth
                />
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete"
                color="primary"
                onClick={() => handleRemoveTableEntry("table2", index)}
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button
            onClick={() => handleAddTableEntry("table2")}
            color="primary"
            variant="contained"
          >
            Add Attempt
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ApexOneSummaryForm;
