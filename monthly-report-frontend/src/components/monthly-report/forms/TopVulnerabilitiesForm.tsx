import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Button, Divider, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {
  addTVDRSN,
  removeTVDRSN,
  updateTVDChartColor,
  updateTVDChartData,
  updateTVDChartKey,
  updateTVDRSN,
  updateTVDRSNKey,
  addTVDChartBar,
  removeTVDChartBar,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";

const TopVulnerabilitiesForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.top_vulnerabilities_detected
  );

  const dispatch = useAppDispatch();

  const handleKeyChange = (index: number, value: string) => {
    dispatch(updateTVDChartKey({ index, value }));
  };

  const handleDataChange = (
    datasetIndex: number,
    index: number,
    value: number
  ) => {
    dispatch(updateTVDChartData({ datasetIndex, index, value }));
  };

  const handleColorChange = (datasetIndex: number, color: string) => {
    dispatch(updateTVDChartColor({ datasetIndex, color }));
  };

  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateTVDRSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addTVDRSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeTVDRSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateTVDRSNKey(value));
  };

  const handleAddChartBar = () => {
    dispatch(addTVDChartBar());
  };

  const handleRemoveChartBar = (index: number) => {
    dispatch(removeTVDChartBar(index));
  };

  return (
    <Grid container xs={12} spacing={2} p={3}>
      <Grid container item spacing={2} xs={12}>
        <Grid item xs={12}>
          <h3>Top Vulnerabilities Detected Chart</h3>
        </Grid>
        {data.impact_chart.key.map((label, index) => (
          <Grid
            container
            item
            xs={12}
            spacing={2}
            key={index}
            alignItems="center"
          >
            <Grid item xs={12}>
              <TextField
                label={`Key ${index + 1}`}
                variant="outlined"
                value={label}
                onChange={(e) => handleKeyChange(index, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={`CVE Impact Score ${index + 1}`}
                variant="outlined"
                value={data.impact_chart.datasets[0].data[index]}
                type="number"
                onChange={(e) =>
                  handleDataChange(0, index, Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={5}>
              <TextField
                label={`Impact Scope ${index + 1}`}
                variant="outlined"
                value={data.impact_chart.datasets[1].data[index]}
                type="number"
                onChange={(e) =>
                  handleDataChange(1, index, Number(e.target.value))
                }
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
        <Grid item xs={6}>
          <MuiColorInput
            label="CVE Impact Score Color"
            value={data.impact_chart.datasets[0].backgroundColor}
            onChange={(color) => handleColorChange(0, color)}
            fullWidth
          />
        </Grid>
        <Grid item xs={6}>
          <MuiColorInput
            label="Impact Scope Color"
            value={data.impact_chart.datasets[1].backgroundColor}
            onChange={(color) => handleColorChange(1, color)}
            fullWidth
          />
        </Grid>
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleAddChartBar}
          >
            Add Chart Bar
          </Button>
        </Grid>
      </Grid>
      {/* RSN Section */}
      <Grid item xs={12}>
        <Divider />
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
export default TopVulnerabilitiesForm;
