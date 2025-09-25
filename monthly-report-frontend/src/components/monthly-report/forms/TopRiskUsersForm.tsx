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
} from "@@/lib/features/monthly-report/monthlySlice";
import RecommendationInput from "@@/components/RecommendationInput";

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
        <h3>Top High Risk Users Chart</h3>
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
        <RecommendationInput values={data.notes} entity="top_risk_users" />
      </Grid>
    </Grid>
  );
};

export default TopRiskUsersForm;
