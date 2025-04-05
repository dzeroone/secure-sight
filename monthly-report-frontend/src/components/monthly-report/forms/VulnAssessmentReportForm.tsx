import { updateNestedField } from "@@/helper/helper";
import {
  addVARRSN,
  removeVARRSN,
  updateVARRSN,
  updateVARRSNKey,
  vulnerabilityAssessmentReport,
} from "@@/lib/features/monthly-report/monthlySlice";
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
  Typography,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import RecommendationInput from "@@/components/RecommendationInput";

const VulnAssessmentReportForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.vulnerability_assessment_report
  );

  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string) => {
    const updatedData = updateNestedField(data, field, value);
    dispatch(vulnerabilityAssessmentReport(updatedData));
  };

  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateVARRSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addVARRSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeVARRSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateVARRSNKey(value));
  };

  return (
    <Grid container xs={12} rowSpacing={3} p={2}>
      <Grid item xs={12}>
        <Typography component="h5">Internal Assets</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Vulnerable endpoint percentage"
          variant="outlined"
          value={data.internal_assets.vulnerable_endpoint}
          onChange={(e) =>
            handleChange("internal_assets.vulnerable_endpoint", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Highly exploitable CVE density"
          variant="outlined"
          value={data.internal_assets.highly_exploitable_cve}
          onChange={(e) =>
            handleChange(
              "internal_assets.highly_exploitable_cve",
              e.target.value
            )
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Devices with legacy windows system"
          variant="outlined"
          value={data.internal_assets.devices_with_windows_legacy}
          onChange={(e) =>
            handleChange(
              "internal_assets.devices_with_windows_legacy",
              e.target.value
            )
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Average unpatched time"
          variant="outlined"
          value={data.internal_assets.average_unpatched_time}
          onChange={(e) =>
            handleChange(
              "internal_assets.average_unpatched_time",
              e.target.value
            )
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Mean time to patch"
          variant="outlined"
          value={data.internal_assets.mttp}
          onChange={(e) => handleChange("internal_assets.mttp", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Highly exploitable unique CVEs"
          variant="outlined"
          value={data.internal_assets.highly_exploitable_unique_cve}
          onChange={(e) =>
            handleChange(
              "internal_assets.highly_exploitable_unique_cve",
              e.target.value
            )
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography component="h5">Internet-Facing Assets</Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Highly exploitable unique CVEs on hosts"
          variant="outlined"
          value={data.internet_facing_assets.unique_cve}
          onChange={(e) =>
            handleChange("internet_facing_assets.unique_cve", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Vulnerable host percentage"
          variant="outlined"
          value={data.internet_facing_assets.vulnerable_host}
          onChange={(e) =>
            handleChange(
              "internet_facing_assets.vulnerable_host",
              e.target.value
            )
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Highly exploitable CVE density hosts"
          variant="outlined"
          value={data.internet_facing_assets.cve_density}
          onChange={(e) =>
            handleChange("internet_facing_assets.cve_density", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <RecommendationInput
          values={data.notes}
          entity="vulnerability_assessment_report"
        />
      </Grid>
    </Grid>
  );
};

export default VulnAssessmentReportForm;
