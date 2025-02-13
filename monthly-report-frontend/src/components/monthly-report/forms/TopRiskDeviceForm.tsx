import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Button,
  Checkbox,
  Divider,
  FormGroup,
  Grid,
  TextField,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { MuiColorInput } from "mui-color-input";
import {
  addTRDChartBar,
  removeTRDChartBar,
  updateTRDChartKey,
  updateTRDChartData,
  updateTRDChartColor,
  addTRDRSN,
  removeTRDRSN,
  updateTRDRSN,
  updateTRDRSNKey,
  updateTRDvisibility,
} from "@@/lib/features/monthly-report/monthlySlice";

const TopRiskDeviceForm = () => {
  const data = useAppSelector((state) => state.monthlyReport.top_risk_device);
  const dispatch = useAppDispatch();

  const handleKeyChange = (index: number, value: string) => {
    dispatch(updateTRDChartKey({ index, value }));
  };

  const handleDataChange = (index: number, value: number) => {
    dispatch(updateTRDChartData({ index, value }));
  };

  const handleColorChange = (color: string) => {
    dispatch(updateTRDChartColor(color));
  };

  const handleAddBar = () => {
    dispatch(addTRDChartBar());
  };

  const handleRemoveBar = (index: number) => {
    dispatch(removeTRDChartBar(index));
  };

  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateTRDRSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addTRDRSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeTRDRSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateTRDRSNKey(value));
  };

  const handleVisibilityChange = (value: boolean) => {
    dispatch(updateTRDvisibility(value));
  };

  return (
    <Grid container spacing={3} p={3}>
      <Grid container item spacing={2} xs={12}>
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
          <Divider />
        </Grid>

        <Grid item xs={12}>
          <h3>Top Risk Devices Chart</h3>
        </Grid>

        {data.risk_score_chart.key.map((label, index) => (
          <Grid
            container
            item
            spacing={2}
            xs={12}
            key={index}
            alignItems="center"
          >
            <Grid item xs={7}>
              <TextField
                label={`Device ${index + 1}`}
                value={label}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={`Risk Score ${index + 1}`}
                value={data.risk_score_chart.datasets[0].data[index]}
                type="number"
                onChange={(e) =>
                  handleDataChange(index, Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete"
                onClick={() => handleRemoveBar(index)}
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Grid item xs={12}>
          <MuiColorInput
            label="Risk Score Color"
            value={data.risk_score_chart.datasets[0].backgroundColor}
            onChange={(color) => handleColorChange(color)}
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAddBar}>
            Add Chart Bar
          </Button>
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
          Add Note
        </Button>
      </Grid>
    </Grid>
  );
};

export default TopRiskDeviceForm;
