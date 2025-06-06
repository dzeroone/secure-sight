import {
  toggleTopRiskVisibility,
  updateLastRiskScoreChart,
  updateRMDate,
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
import RecommendationInput from "@@/components/RecommendationInput";

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
        <RecommendationInput values={data.notes} entity="risk_metrics" />
      </Grid>
    </Grid>
  );
};

export default RiskMetricsForm;
