import RecommendationInput from "@@/components/RecommendationInput";
import { updateNestedField } from "@@/helper/helper";
import { systemConfigurationReport } from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Divider,
  Grid,
  TextField,
  Typography
} from "@mui/material";

const SystemConfigReportForm: React.FC = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.system_configuration_report
  );
  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string) => {
    const updatedData = updateNestedField(data, field, value);
    dispatch(systemConfigurationReport(updatedData));
  };

  return (
    <Grid container xs={12} rowSpacing={3} p={2}>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Account with weak authentication"
          variant="outlined"
          value={data.accounts_with_weak_auth}
          onChange={(e) =>
            handleChange("accounts_with_weak_auth", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Accounts that increases attack surface risk"
          variant="outlined"
          value={data.account_attack_surface_risk}
          onChange={(e) =>
            handleChange("account_attack_surface_risk", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Accounts with excessive privilege"
          variant="outlined"
          value={data.accounts_with_excessive_privilege}
          onChange={(e) =>
            handleChange("accounts_with_excessive_privilege", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Legacy logon activity"
          variant="outlined"
          value={data.legacy_auth_logon_activity}
          onChange={(e) =>
            handleChange("legacy_auth_logon_activity", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <Typography component="h5">
          UNEXPECTED INTERNET-FACING SERVICES/PORTS
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Unique unexpected services/ports"
          variant="outlined"
          value={data.unexpected_internet_facing_serve_port.service_port}
          onChange={(e) =>
            handleChange(
              "unexpected_internet_facing_serve_port.service_port",
              e.target.value
            )
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Total public IPs affected"
          variant="outlined"
          value={data.unexpected_internet_facing_serve_port.affected_ip}
          onChange={(e) =>
            handleChange(
              "unexpected_internet_facing_serve_port.affected_ip",
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
        <Typography component="h5">
          HOSTS WITH INSECURE CONNECTION ISSUES
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Total public IPs affected"
          variant="outlined"
          value={data.host_with_insecure_connection.insecure_connection}
          onChange={(e) =>
            handleChange(
              "host_with_insecure_connection.insecure_connection",
              e.target.value
            )
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          type="text"
          label="Total connection issues"
          variant="outlined"
          value={data.host_with_insecure_connection.total}
          onChange={(e) =>
            handleChange("host_with_insecure_connection.total", e.target.value)
          }
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <RecommendationInput
          values={data.notes}
          entity="system_configuration_report"
        />
      </Grid>
    </Grid>
  );
};

export default SystemConfigReportForm;
