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
import { AgentVersionsSummary } from "@@/types/types";
import {
  updateAVSChartColor,
  updateAVSChartData,
  updateAVSChartKey,
  updateAVSSCvisibility,
  updateAVSSEPCvisibility,
  updateAVSWPCCvisibility,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";
import RecommendationInput from "@@/components/RecommendationInput";

const AgentVersionForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.agent_versions_summary
  );

  const dispatch = useAppDispatch();

  const handleKeyChange = (
    chart: keyof AgentVersionsSummary,
    index: number,
    value: string
  ) => {
    dispatch(updateAVSChartKey({ chart, index, value }));
  };

  const handleDataChange = (
    chart: keyof AgentVersionsSummary,
    datasetIndex: number,
    index: number,
    value: number
  ) => {
    dispatch(updateAVSChartData({ chart, datasetIndex, index, value }));
  };

  const handleColorChange = (
    chart: keyof AgentVersionsSummary,
    datasetIndex: number,
    color: string
  ) => {
    dispatch(updateAVSChartColor({ chart, datasetIndex, color }));
  };

  const handleSCVisibilityChange = (value: boolean) => {
    dispatch(updateAVSSCvisibility(value));
  };
  const handleWPCCVisibilityChange = (value: boolean) => {
    dispatch(updateAVSWPCCvisibility(value));
  };
  const handleSEPCVisibilityChange = (value: boolean) => {
    dispatch(updateAVSSEPCvisibility(value));
  };

  return (
    <Grid container spacing={3} p={3}>
      {/* Agent Versions Summary Chart */}
      <Grid container item xs={12} rowSpacing={2}>
        <Grid item xs={12}>
          <h3>Agent Versions Summary Chart</h3>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.agent_version_chart.visible}
                  onChange={(e) => handleSCVisibilityChange(e.target.checked)}
                />
              }
              label="Show/Hide"
            />
          </FormGroup>
        </Grid>
        {data.agent_version_chart.key.map((label, index) => (
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
                onChange={(e) =>
                  handleKeyChange("agent_version_chart", index, e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                label={`Data ${index + 1}`}
                variant="outlined"
                value={data.agent_version_chart.datasets[0].data[index]}
                type="number"
                onChange={(e) =>
                  handleDataChange(
                    "agent_version_chart",
                    0,
                    index,
                    Number(e.target.value)
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={4}>
              <MuiColorInput
                label={`Color ${index + 1}`}
                value={
                  Array.isArray(
                    data.agent_version_chart.datasets[0].backgroundColor
                  )
                    ? data.agent_version_chart.datasets[0].backgroundColor[
                        index
                      ]
                    : ""
                }
                onChange={(color) =>
                  handleColorChange("agent_version_chart", index, color)
                }
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
      </Grid>

      {/* Server & Workload Protection Chart */}
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container item xs={12} rowSpacing={2}>
        <Grid item xs={12}>
          <h3>Server & Workload Protection Chart</h3>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.server_workload_protection_chart.visible}
                  onChange={(e) => handleWPCCVisibilityChange(e.target.checked)}
                />
              }
              label="Show/Hide"
            />
          </FormGroup>
        </Grid>
        {data.server_workload_protection_chart.key.map((label, index) => (
          <Grid
            container
            item
            xs={12}
            spacing={2}
            key={index}
            alignItems="center"
          >
            <Grid item xs={6}>
              <TextField
                label={`Key ${index + 1}`}
                variant="outlined"
                value={label}
                onChange={(e) =>
                  handleKeyChange(
                    "server_workload_protection_chart",
                    index,
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`Data ${index + 1}`}
                variant="outlined"
                value={
                  data.server_workload_protection_chart.datasets[0].data[index]
                }
                type="number"
                onChange={(e) =>
                  handleDataChange(
                    "server_workload_protection_chart",
                    0,
                    index,
                    Number(e.target.value)
                  )
                }
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <MuiColorInput
            label="Chart Color"
            value={
              data.server_workload_protection_chart.datasets[0]
                .backgroundColor as string
            }
            onChange={(color) =>
              handleColorChange("server_workload_protection_chart", 0, color)
            }
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Standard Endpoint Protection Chart */}
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container item xs={12} spacing={2}>
        <Grid item xs={12}>
          <h3>Standard Endpoint Protection Chart</h3>
        </Grid>
        <Grid item xs={12}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={data.standard_endpoint_protection_chart.visible}
                  onChange={(e) => handleSEPCVisibilityChange(e.target.checked)}
                />
              }
              label="Show/Hide"
            />
          </FormGroup>
        </Grid>
        {data.standard_endpoint_protection_chart.key.map((label, index) => (
          <Grid
            container
            item
            xs={12}
            spacing={2}
            key={index}
            alignItems="center"
          >
            <Grid item xs={6}>
              <TextField
                label={`Key ${index + 1}`}
                variant="outlined"
                value={label}
                onChange={(e) =>
                  handleKeyChange(
                    "standard_endpoint_protection_chart",
                    index,
                    e.target.value
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`Data ${index + 1}`}
                variant="outlined"
                value={
                  data.standard_endpoint_protection_chart.datasets[0].data[
                    index
                  ]
                }
                type="number"
                onChange={(e) =>
                  handleDataChange(
                    "standard_endpoint_protection_chart",
                    0,
                    index,
                    Number(e.target.value)
                  )
                }
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <MuiColorInput
            label="Chart Color"
            value={
              data.standard_endpoint_protection_chart.datasets[0]
                .backgroundColor as string
            }
            onChange={(color) =>
              handleColorChange("standard_endpoint_protection_chart", 0, color)
            }
            fullWidth
          />
        </Grid>
      </Grid>

      {/* Recommendations/Notes/Summary */}
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <RecommendationInput
          values={data.notes}
          entity="agent_versions_summary"
        />
      </Grid>
    </Grid>
  );
};

export default AgentVersionForm;
