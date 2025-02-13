import {
  updateOISChart,
  updateOISField,
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Divider, Grid, TextField } from "@mui/material";
import { MuiColorInput } from "mui-color-input";

const OverallIncidentSummaryForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.overall_incident_summary
  );
  const firstPage = useAppSelector(
    (state) => state.monthlyReport.monthly_report
  );
  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string | number) => {
    dispatch(updateOISField({ path: field, value }));
  };

  const handleChartChange = (index: number, value: number) => {
    const newDatasets = [...data.incidents_chart.datasets];
    newDatasets[0] = {
      ...newDatasets[0],
      data: newDatasets[0].data.map((d, i) => (i === index ? value : d)),
    };
    dispatch(updateOISChart(newDatasets));
  };

  const handleColorChange = (color: string) => {
    const newDatasets = data.incidents_chart.datasets.map((dataset) => ({
      ...dataset,
      backgroundColor: color,
    }));
    dispatch(updateOISChart(newDatasets));
  };
  return (
    <Grid container spacing={3} p={2}>
      <Grid container item spacing={2} xs={12}>
        <Grid container item xs={12}>
          <h3>Incidents Chart</h3>
        </Grid>
        {data.incidents_chart.key.map((label, index) => (
          <Grid item xs={12} md={6} key={index}>
            <TextField
              label={label}
              variant="outlined"
              value={data.incidents_chart.datasets[0].data[index]}
              onChange={(e) =>
                handleChartChange(index, parseInt(e.target.value, 10))
              }
              fullWidth
            />
          </Grid>
        ))}
        <Grid item xs={12} md={6}>
          <MuiColorInput
            value={data.incidents_chart.datasets[0].backgroundColor}
            onChange={handleColorChange}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      {/* P1 */}
      <Grid container item spacing={2} xs={12}>
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

export default OverallIncidentSummaryForm;
