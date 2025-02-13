import {
  addRMSRSN,
  removeRMSRSN,
  toggleTopRiskVisibility,
  updateLastRiskScoreChart,
  updateRMDate,
  updateRMSRSN,
  updateRMSRSNKey,
  updateTopRiskIndicator,
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";
import ClearIcon from "@mui/icons-material/Clear";

const RiskMetricsForm = () => {
  const data = useAppSelector((state) => state.monthlyReport.risk_metrics);

  const dispatch = useAppDispatch();

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(updateRMDate(e.target.value));
  };

  const handleChartChange = (index: number, field: string, value: any) => {
    if (field === "data") {
      const dataValue = parseInt(value, 10);
      dispatch(updateLastRiskScoreChart({ index, field, value: [dataValue] }));
    } else {
      dispatch(updateLastRiskScoreChart({ index, field, value }));
    }
  };

  const handleIndicatorChange = (
    index: number,
    field: string,
    value: string
  ) => {
    dispatch(updateTopRiskIndicator({ index, field, value }));
  };

  const handleToggleVisibility = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(toggleTopRiskVisibility(e.target.checked));
  };

  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateRMSRSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addRMSRSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeRMSRSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateRMSRSNKey(value));
  };

  return (
    <Grid container xs={12} p={3} spacing={2}>
      <Grid item xs={12}>
        <TextField
          label="Date"
          variant="outlined"
          value={data.date}
          onChange={handleDateChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid container item xs={12}>
        <h3>Risk Score</h3>
        <Grid container spacing={3} p={2}>
          {data.last_risk_score.charts.map((chart, i) => (
            <Grid container item xs={12} spacing={3} key={i}>
              <Grid item xs={6}>
                <TextField
                  label="Data Point"
                  variant="outlined"
                  type="number"
                  value={chart.datasets[0].data[0]}
                  onChange={(e) =>
                    handleChartChange(i, "data", [
                      parseInt(e.target.value),
                      100,
                    ])
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Month"
                  value={chart.month}
                  onChange={(e) =>
                    handleChartChange(i, "month", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <MuiColorInput
                  label="Color"
                  value={chart.datasets[0].backgroundColor[0]}
                  onChange={(color) =>
                    handleChartChange(i, "backgroundColor", [
                      color,
                      "rgb(195, 195, 198)",
                    ])
                  }
                  fullWidth
                />
              </Grid>
            </Grid>
          ))}
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid container item xs={12}>
        <h3>Top Risks Incidents Detected</h3>
        <Grid item xs={12}>
          <FormControl component="fieldset">
            <FormGroup>
              <FormControlLabel
                label="Show/Hide top risks indicator"
                control={
                  <Checkbox
                    name="trid"
                    checked={data.top_risk_incidents.visible}
                    onChange={handleToggleVisibility}
                  />
                }
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <h3>Top Risk Vectors based on Incidents detected</h3>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          {data.top_risk_incidents.indicators.map((indicator, j) => (
            <Grid container item xs={12} spacing={2} key={j}>
              <Grid item xs={6}>
                <TextField
                  label="Risk Name"
                  value={indicator.risk_name}
                  onChange={(e) =>
                    handleIndicatorChange(j, "risk_name", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Value</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={indicator.value}
                    label="Value"
                    onChange={(e) =>
                      handleIndicatorChange(j, "value", e.target.value)
                    }
                  >
                    <MenuItem value={"Low"}>Low</MenuItem>
                    <MenuItem value={"Medium"}>Medium</MenuItem>
                    <MenuItem value={"High"}>High</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          ))}
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

export default RiskMetricsForm;
