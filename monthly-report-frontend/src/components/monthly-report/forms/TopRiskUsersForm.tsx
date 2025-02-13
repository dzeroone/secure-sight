import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Button,
  Checkbox,
  Divider,
  FormGroup,
  Grid,
  TextField,
  IconButton,
  FormControlLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { MuiColorInput } from "mui-color-input";
import {
  addTRUChartBar,
  removeTRUChartBar,
  updateTRUChartKey,
  updateTRUChartData,
  updateTRUChartColor,
  updateTRUvisibility,
  updateTRURSN,
  addTRURSN,
  removeTRURSN,
  updateTRURSNKey,
} from "@@/lib/features/monthly-report/monthlySlice";

const TopRiskUsersForm = () => {
  const data = useAppSelector((state) => state.monthlyReport.top_risk_users);
  const dispatch = useAppDispatch();

  const handleKeyChange = (index: number, value: string) => {
    dispatch(updateTRUChartKey({ index, value }));
  };

  const handleDataChange = (index: number, value: number) => {
    dispatch(updateTRUChartData({ index, value }));
  };

  const handleColorChange = (color: string) => {
    dispatch(updateTRUChartColor(color));
  };

  const handleAddChartBar = () => {
    dispatch(addTRUChartBar());
  };

  const handleRemoveChartBar = (index: number) => {
    dispatch(removeTRUChartBar(index));
  };

  const handleVisibilityChange = (value: boolean) => {
    dispatch(updateTRUvisibility(value));
  };
  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateTRURSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addTRURSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeTRURSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateTRURSNKey(value));
  };

  return (
    <Grid container spacing={3} p={3}>
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
        <h3>Top Risk Users Chart</h3>
      </Grid>

      {data.risk_score_chart.key.map((label, index) => (
        <Grid
          container
          item
          xs={12}
          spacing={2}
          key={index}
          alignItems="center"
        >
          <Grid item xs={5}>
            <TextField
              label={`Device ${index + 1}`}
              variant="outlined"
              value={label}
              onChange={(e) => handleKeyChange(index, e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={5}>
            <TextField
              label={`Risk Score ${index + 1}`}
              variant="outlined"
              type="number"
              value={data.risk_score_chart.datasets[0].data[index]}
              onChange={(e) => handleDataChange(index, Number(e.target.value))}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => handleRemoveChartBar(index)}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}

      <Grid item xs={12}>
        <Button variant="contained" onClick={handleAddChartBar}>
          Add Bar
        </Button>
      </Grid>

      <Grid item xs={12}>
        <MuiColorInput
          label="Risk Score Color"
          value={data.risk_score_chart.datasets[0].backgroundColor}
          onChange={(color) => handleColorChange(color)}
          fullWidth
        />
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

export default TopRiskUsersForm;
