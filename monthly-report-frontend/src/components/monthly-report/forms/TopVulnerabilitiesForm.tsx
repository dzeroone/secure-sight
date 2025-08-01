import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Button,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {
  updateTVDChartColor,
  updateTVDChartData,
  updateTVDChartKey,
  addTVDChartBar,
  removeTVDChartBar,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";
import RecommendationInput from "@@/components/RecommendationInput";

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
                label={`CVSS Score ${index + 1}`}
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
            label="CVSS Score Color"
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
        <RecommendationInput
          values={data.notes}
          entity="top_vulnerabilities_detected"
        />
      </Grid>
    </Grid>
  );
};
export default TopVulnerabilitiesForm;
