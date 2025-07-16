import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Button, Divider, Grid, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {
  addSLOEntry,
  removeSLOEntry,
  updateSLOChartColor,
  updateSLOChartData,
  updateSLOChartKey,
  updateSLOEntry,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";
import { SLOTableType } from "@@/types/types";

const SLOSummaryForm = () => {
  const data = useAppSelector((state) => state.monthlyReport.slo_summary);

  const dispatch = useAppDispatch();

  const handleChange = (index: number, field: keyof SLOTableType, value: string) => {
    dispatch(updateSLOEntry({ index, field, value }));
  };

  const handleChartKeyChange = (index: number, value: string) => {
    dispatch(updateSLOChartKey({ index, value }));
  };

  const handleChartDataChange = (index: number, value: string) => {
    dispatch(updateSLOChartData({ index, value: Number(value) }));
  };

  const handleChartColorChange = (color: string) => {
    dispatch(updateSLOChartColor(color));
  };

  const handleRemove = (index: number) => {
    dispatch(removeSLOEntry(index));
  };

  const handleAdd = () => {
    dispatch(addSLOEntry());
  };

  return (
    <Grid container spacing={3} p={2}>
      <Grid container item xs={12} rowSpacing={2}>
        <h3>SLO Chart</h3>
      </Grid>
      <Grid container item spacing={2} xs={12}>
        {data.slo_chart.key.map((key, index) => (
          <Grid container item spacing={2} key={index} alignItems="center">
            <Grid item xs={6}>
              <TextField
                label={`Chart Key ${index + 1}`}
                variant="outlined"
                value={key}
                onChange={(e) => handleChartKeyChange(index, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`Data ${index + 1}`}
                variant="outlined"
                value={(data.slo_chart.datasets[0].data[index] != null && data.slo_chart.datasets[0].data[index] != undefined) ? data.slo_chart.datasets[0].data[index].toString() : ""}
                onChange={(e) => handleChartDataChange(index, e.target.value)}
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid item xs={12}>
        <MuiColorInput
          label="Chart Color"
          value={data.slo_chart.datasets[0].backgroundColor}
          onChange={handleChartColorChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container rowSpacing={2} item xs={12}>
        <h3>Service Level Objective (SLO)</h3>
        {data.slo_table.map((item, index) => (
          <Grid
            container
            item
            xs={12}
            spacing={2}
            alignItems="center"
            key={index}
          >
            <Grid container item spacing={2} xs={11}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Priority"
                  variant="outlined"
                  value={item.priority}
                  onChange={(e) =>
                    handleChange(index, "priority", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Response Time"
                  variant="outlined"
                  value={item.response_time}
                  onChange={(e) =>
                    handleChange(index, "response_time", e.target.value)
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Description"
                  variant="outlined"
                  value={item.description}
                  onChange={(e) =>
                    handleChange(index, "description", e.target.value)
                  }
                  fullWidth
                  multiline
                  rows={3}
                />
              </Grid>
            </Grid>
            <Grid item xs={1}>
              <IconButton
                aria-label="delete"
                color="primary"
                onClick={() => handleRemove(index)}
              >
                <ClearIcon />
              </IconButton>
            </Grid>
            <Grid item xs={12}>
              <Divider />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <Button variant="contained" color="primary" onClick={handleAdd}>
            Add
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SLOSummaryForm;
