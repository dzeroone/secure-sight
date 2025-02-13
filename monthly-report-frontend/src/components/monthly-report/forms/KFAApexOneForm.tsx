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
  addKFAAPEXRSN,
  removeKFAAPEXRSN,
  updateKFAAPEXChartColor,
  updateKFAAPEXChartData,
  updateKFAAPEXChartKey,
  updateKFAAPEXRSN,
  updateKFAAPEXRSNKey,
  updateKFAAPEXvisibility,
  addKFAAPEXChartBar,
  removeKFAAPEXChartBar,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";

const KFAApexOneForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.key_feature_adoption_apex_one
  );
  const dispatch = useAppDispatch();

  const handleKeyChange = (index: number, value: string) => {
    dispatch(updateKFAAPEXChartKey({ index, value }));
  };

  const handleDataChange = (
    datasetIndex: number,
    index: number,
    value: number
  ) => {
    dispatch(updateKFAAPEXChartData({ datasetIndex, index, value }));
  };

  const handleColorChange = (datasetIndex: number, color: string) => {
    dispatch(updateKFAAPEXChartColor({ datasetIndex, color }));
  };

  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateKFAAPEXRSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addKFAAPEXRSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeKFAAPEXRSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateKFAAPEXRSNKey(value));
  };

  const handleVisibilityChange = (value: boolean) => {
    dispatch(updateKFAAPEXvisibility(value));
  };

  const handleAddBar = () => {
    dispatch(addKFAAPEXChartBar());
  };

  const handleRemoveBar = (index: number) => {
    dispatch(removeKFAAPEXChartBar(index));
  };

  return (
    <Grid container spacing={3} p={3}>
      <Grid container item xs={12} rowSpacing={2}>
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
          <h3>
            Key Feature Adoption Rate of Apex One as Service / Std Endpoint
            Protection Chart
          </h3>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid container item spacing={2} xs={12}>
        {data.apex_one_chart.key.map((label, index) => (
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
                value={data.apex_one_chart.datasets[0].data[index]}
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
                value={data.apex_one_chart.datasets[1].data[index]}
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
            value={data.apex_one_chart.datasets[0].backgroundColor}
            onChange={(color) => handleColorChange(0, color)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <MuiColorInput
            label="Count Color"
            value={data.apex_one_chart.datasets[1].backgroundColor}
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
        <h3>Recommendations/Notes/Summary</h3>
      </Grid>

      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="rsn-label">Recommendations/Notes/Summary</InputLabel>
          <Select
            labelId="rsn-label"
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

      {data.rsn.data.map((note, k) => (
        <Grid container item xs={12} alignItems="center" spacing={2} key={k}>
          <Grid item xs={10}>
            <TextField
              label="Recommendations/Notes/Summary"
              variant="outlined"
              value={note}
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

export default KFAApexOneForm;
