import { updateSIEMField, updateSIEMvisibility } from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  TextField,
} from "@mui/material";

const SiemIncidentSummaryForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.siem_incident_summary
  );
  const firstPage = useAppSelector(
    (state) => state.monthlyReport.monthly_report
  );
  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string | number) => {
    dispatch(updateSIEMField({ path: field, value }));
  };
  const handleVisibilityChange = (value: boolean) => {
    dispatch(updateSIEMvisibility(value));
  };
  return (
    <Grid container spacing={3} p={2}>
      {/* P1 */}
      <Grid container item spacing={2} xs={12}>
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
          <h3>P1 - Critical Severity Incidents</h3>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Customer Name"
            variant="outlined"
            value={firstPage.customer_name}
            // onChange={(e) =>
            //   handleChange(
            //     "p1.pending_with_customer.customer_name",
            //     e.target.value
            //   )
            // }
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Total Incidents"
            variant="outlined"
            value={data.p1.total_incidents}
            onChange={(e) =>
              handleChange("p1.total_incidents", parseInt(e.target.value, 10))
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Closed with Resolution"
            variant="outlined"
            value={data.p1.closed_with_resolution}
            onChange={(e) =>
              handleChange(
                "p1.closed_with_resolution",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Closed without Acknowledgement"
            variant="outlined"
            value={data.p1.closed_without_resolution}
            onChange={(e) =>
              handleChange(
                "p1.closed_without_resolution",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pending Incidents With Customer"
            variant="outlined"
            value={data.p1.pending_with_customer.pending_incidents}
            onChange={(e) =>
              handleChange(
                "p1.pending_with_customer.pending_incidents",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pending Incidents With SOC Team"
            variant="outlined"
            value={data.p1.pending_with_soc_team}
            onChange={(e) =>
              handleChange(
                "p1.pending_with_soc_team",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container item spacing={2} xs={12}>
        <Grid item xs={12}>
          <h3>P2 - High Severity Incidents</h3>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Customer Name"
            variant="outlined"
            value={firstPage.customer_name}
            // onChange={(e) =>
            //   handleChange(
            //     "p2.pending_with_customer.customer_name",
            //     e.target.value
            //   )
            // }
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Total Incidents"
            variant="outlined"
            value={data.p2.total_incidents}
            onChange={(e) =>
              handleChange("p2.total_incidents", parseInt(e.target.value, 10))
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Closed with Resolution"
            variant="outlined"
            value={data.p2.closed_with_resolution}
            onChange={(e) =>
              handleChange(
                "p2.closed_with_resolution",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Closed without Acknowledgement"
            variant="outlined"
            value={data.p2.closed_without_resolution}
            onChange={(e) =>
              handleChange(
                "p2.closed_without_resolution",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pending Incidents With Customer"
            variant="outlined"
            value={data.p2.pending_with_customer.pending_incidents}
            onChange={(e) =>
              handleChange(
                "p2.pending_with_customer.pending_incidents",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pending Incidents With SOC Team"
            variant="outlined"
            value={data.p2.pending_with_soc_team}
            onChange={(e) =>
              handleChange(
                "p2.pending_with_soc_team",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container item spacing={2} xs={12}>
        <Grid item xs={12}>
          <h3>P3 - Medium Severity Incidents</h3>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Customer Name"
            variant="outlined"
            value={firstPage.customer_name}
            // onChange={(e) =>
            //   handleChange(
            //     "p3.pending_with_customer.customer_name",
            //     e.target.value
            //   )
            // }
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Total Incidents"
            variant="outlined"
            value={data.p3.total_incidents}
            onChange={(e) =>
              handleChange("p3.total_incidents", parseInt(e.target.value, 10))
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Closed with Resolution"
            variant="outlined"
            value={data.p3.closed_with_resolution}
            onChange={(e) =>
              handleChange(
                "p3.closed_with_resolution",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Closed without Acknowledgement"
            variant="outlined"
            value={data.p3.closed_without_resolution}
            onChange={(e) =>
              handleChange(
                "p3.closed_without_resolution",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pending Incidents With Customer"
            variant="outlined"
            value={data.p3.pending_with_customer.pending_incidents}
            onChange={(e) =>
              handleChange(
                "p3.pending_with_customer.pending_incidents",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pending Incidents With SOC Team"
            variant="outlined"
            value={data.p3.pending_with_soc_team}
            onChange={(e) =>
              handleChange(
                "p3.pending_with_soc_team",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid container item spacing={2} xs={12}>
        <Grid item xs={12}>
          <h3>P4 - Low Severity Incidents</h3>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Customer Name"
            variant="outlined"
            value={firstPage.customer_name}
            // onChange={(e) =>
            //   handleChange(
            //     "p4.pending_with_customer.customer_name",
            //     e.target.value
            //   )
            // }
            fullWidth
            disabled
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Total Incidents"
            variant="outlined"
            value={data.p4.total_incidents}
            onChange={(e) =>
              handleChange("p4.total_incidents", parseInt(e.target.value, 10))
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Closed with Resolution"
            variant="outlined"
            value={data.p4.closed_with_resolution}
            onChange={(e) =>
              handleChange(
                "p4.closed_with_resolution",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Closed without Acknowledgement"
            variant="outlined"
            value={data.p4.closed_without_resolution}
            onChange={(e) =>
              handleChange(
                "p4.closed_without_resolution",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pending Incidents With Customer"
            variant="outlined"
            value={data.p4.pending_with_customer.pending_incidents}
            onChange={(e) =>
              handleChange(
                "p4.pending_with_customer.pending_incidents",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TextField
            label="Pending Incidents With SOC Team"
            variant="outlined"
            value={data.p4.pending_with_soc_team}
            onChange={(e) =>
              handleChange(
                "p4.pending_with_soc_team",
                parseInt(e.target.value, 10)
              )
            }
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default SiemIncidentSummaryForm;
