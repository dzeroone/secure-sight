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
  addEPFRSN,
  removeEPFRSN,
  updateEPFChartColor,
  updateEPFChartData,
  updateEPFChartKey,
  updateEPFRSN,
  updateEPFRSNKey,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";
import RecommendationInput from "@@/components/RecommendationInput";

const EndpointFeatureForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.endpoint_feature_compliance
  );

  const dispatch = useAppDispatch();

  const handleKeyChange = (index: number, value: string) => {
    dispatch(updateEPFChartKey({ index, value }));
  };

  const handleDataChange = (index: number, value: number) => {
    dispatch(updateEPFChartData({ index, value }));
  };

  const handleColorChange = (color: string) => {
    dispatch(updateEPFChartColor(color));
  };

  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateEPFRSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addEPFRSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeEPFRSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateEPFRSNKey(value));
  };
  return (
    <Grid container spacing={3} p={3}>
      <Grid container item xs={12} spacing={2}>
        <h3>Endpoint Feature Compliance</h3>
        {data.compliance_chart.key.map((label, index) => (
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
                onChange={(e) => handleKeyChange(index, e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`Data ${index + 1}`}
                variant="outlined"
                value={data.compliance_chart.datasets[0].data[index]}
                type="number"
                onChange={(e) =>
                  handleDataChange(index, Number(e.target.value))
                }
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
        <Grid item xs={12}>
          <MuiColorInput
            label="Chart Color"
            value={data.compliance_chart.datasets[0].backgroundColor}
            onChange={(color) => handleColorChange(color)}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <RecommendationInput
          values={data.notes}
          entity="endpoint_feature_compliance"
        />
      </Grid>
    </Grid>
  );
};

export default EndpointFeatureForm;
