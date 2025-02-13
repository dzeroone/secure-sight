import {
  addDSTopIncident,
  removeDSTopIncident,
  updateDSChartColor,
  updateDSChartData,
  updateDSChartText,
  updateDSCheckboxField,
  updateDSField,
  updateDSTopIncidentField,
  updateLicenseAndDc, // Import the new action
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { MuiColorInput } from "mui-color-input";

const DetailedSummary = () => {
  const report = useAppSelector(
    (state) => state.monthlyReport.detailed_summary
  );
  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string) => {
    dispatch(updateDSField({ field, value }));
  };

  const handleTopIncidentChange = (
    index: number,
    field: string,
    value: string
  ) => {
    dispatch(updateDSTopIncidentField({ index, field, value }));
  };

  const handleAddTopIncident = () => {
    dispatch(addDSTopIncident());
  };

  const handleRemoveTopIncident = (index: number) => {
    dispatch(removeDSTopIncident(index));
  };

  const handleCheckboxChange = (field: string, value: boolean) => {
    dispatch(updateDSCheckboxField({ field, value }));
  };

  const handleChartDataChange = (index: number, value: number) => {
    dispatch(updateDSChartData({ index, value }));
  };

  const handleChartColorChange = (index: number, color: string) => {
    dispatch(updateDSChartColor({ index, color }));
  };
  const handleChangeChartText = (value: string) => {
    dispatch(updateDSChartText(value));
  };

  const handleLicenseDateChange = (
    field: "license_consumption_text" | "data_consumption_text",
    value: string
  ) => {
    dispatch(updateLicenseAndDc({ field, value }));
  };

  return (
    <Grid container spacing={3} p={2}>
      <Grid item xs={12}>
        <TextField
          label="No. of Incidents"
          variant="outlined"
          value={report.no_of_incidents}
          onChange={(e) => handleChange("no_of_incidents", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Months"
          variant="outlined"
          value={report.date}
          onChange={(e) => handleChange("date", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Highly Exploitable"
          variant="outlined"
          value={report.highly_exploitable}
          onChange={(e) => handleChange("highly_exploitable", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Incidents Closed"
          variant="outlined"
          value={report.incidents_closed}
          onChange={(e) => handleChange("incidents_closed", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <h3>Risk Index Chart</h3>
      </Grid>
      <Grid container spacing={3} p={2}>
        <Grid container item xs={12} spacing={3}>
          <Grid item xs={6}>
            <TextField
              label={`Data Point`}
              variant="outlined"
              type="number"
              value={report.risk_index_chart.datasets[0].data[0]}
              onChange={(e) =>
                handleChartDataChange(0, parseInt(e.target.value))
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <MuiColorInput
              label={`Color`}
              value={report.risk_index_chart.datasets[0].backgroundColor[0]}
              onChange={(color) => handleChartColorChange(0, color)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              value={report.risk_index_text}
              onChange={(e) => handleChangeChartText(e.target.value)}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <h3>Top 05 Incidents</h3>
      </Grid>
      <Grid container spacing={3} p={2}>
        {report.top_incidents.map((item, i) => (
          <Grid container item xs={12} spacing={2} alignItems="center" key={i}>
            <Grid item xs={12}>
              <TextField
                label="Incident Names"
                variant="outlined"
                value={item.incident_name}
                onChange={(e) =>
                  handleTopIncidentChange(i, "incident_name", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Priority Impact"
                variant="outlined"
                value={item.priority_impact}
                onChange={(e) =>
                  handleTopIncidentChange(i, "priority_impact", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label="Data Source"
                variant="outlined"
                value={item.data_source}
                onChange={(e) =>
                  handleTopIncidentChange(i, "data_source", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                aria-label="delete"
                color="primary"
                onClick={() => handleRemoveTopIncident(i)}
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
            onClick={handleAddTopIncident}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="License Consumption"
          variant="outlined"
          value={report.license_consumption_text}
          onChange={(e) =>
            handleLicenseDateChange("license_consumption_text", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          label="Data Consumption"
          variant="outlined"
          value={report.data_consumption_text}
          onChange={(e) =>
            handleLicenseDateChange("data_consumption_text", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={report.license_consumption}
              onChange={(e) =>
                handleCheckboxChange("license_consumption", e.target.checked)
              }
            />
          }
          label="License Consumption"
        />
      </Grid>
      <Grid item xs={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={report.data_consumption}
              onChange={(e) =>
                handleCheckboxChange("data_consumption", e.target.checked)
              }
            />
          }
          label="Data Consumption"
        />
      </Grid>
    </Grid>
  );
};

export default DetailedSummary;
