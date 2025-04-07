import React from "react";
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
import ClearIcon from "@mui/icons-material/Clear";
import {
  updateKFAWLSChartColor,
  updateKFAWLSChartData,
  updateKFAWLSChartKey,
  updateKFWLSvisibility,
  addBar,
  removeBar,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";
import RecommendationInput from "@@/components/RecommendationInput";

const KFAWorkloadForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.key_feature_adoption_server_workload
  );

  const dispatch = useAppDispatch();

  const handleKeyChange = (index: number, value: string) => {
    dispatch(updateKFAWLSChartKey({ index, value }));
  };

  const handleDataChange = (
    datasetIndex: number,
    index: number,
    value: number
  ) => {
    dispatch(updateKFAWLSChartData({ datasetIndex, index, value }));
  };

  const handleColorChange = (datasetIndex: number, color: string) => {
    dispatch(updateKFAWLSChartColor({ datasetIndex, color }));
  };

  const handleVisibilityChange = (value: boolean) => {
    dispatch(updateKFWLSvisibility(value));
  };

  const handleAddBar = () => {
    dispatch(addBar());
  };

  const handleRemoveBar = (index: number) => {
    dispatch(removeBar(index));
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
        <Divider />
      </Grid>
      <Grid container item xs={12}>
        <h3>
          Key Feature Adoption Rate of Server & Workload Security / Protection
        </h3>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container item spacing={2} xs={12}>
        {data.workload_security_chart.key.map((label, index) => (
          <Grid
            container
            item
            xs={12}
            spacing={2}
            key={index}
            alignItems="center"
          >
            <Grid item xs={4}>
              <TextField
                label={`Key ${index + 1}`}
                variant="outlined"
                value={label}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={3.5}>
              <TextField
                label={`Total ${index + 1}`}
                variant="outlined"
                value={data.workload_security_chart.datasets[0].data[index]}
                type="number"
                onChange={(e) =>
                  handleDataChange(0, index, Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={3.5}>
              <TextField
                label={`Count ${index + 1}`}
                variant="outlined"
                value={data.workload_security_chart.datasets[1].data[index]}
                type="number"
                onChange={(e) =>
                  handleDataChange(1, index, Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete"
                color="primary"
                onClick={() => handleRemoveBar(index)}
              >
                <ClearIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}
        <Grid item xs={6}>
          <MuiColorInput
            label="Total Color"
            value={data.workload_security_chart.datasets[0].backgroundColor}
            onChange={(color) => handleColorChange(0, color)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <MuiColorInput
            label="Count Color"
            value={data.workload_security_chart.datasets[1].backgroundColor}
            onChange={(color) => handleColorChange(1, color)}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleAddBar}>
          Add Bar
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <RecommendationInput
          values={data.notes}
          entity="key_feature_adoption_server_workload"
        />
      </Grid>
    </Grid>
  );
};

export default KFAWorkloadForm;
