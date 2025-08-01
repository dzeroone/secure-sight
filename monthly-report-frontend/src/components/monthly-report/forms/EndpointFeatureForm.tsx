import RecommendationInput from "@@/components/RecommendationInput";
import {
  updateEPFChartColor,
  updateEPFChartData,
  updateEPFChartKey,
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Divider,
  Grid,
  TextField
} from "@mui/material";
import { MuiColorInput } from "mui-color-input";

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
