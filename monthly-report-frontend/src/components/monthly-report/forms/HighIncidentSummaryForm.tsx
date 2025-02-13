import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {
  addHISIncident,
  removeHISIncident,
  updateHISIncident,
} from "@@/lib/features/monthly-report/monthlySlice";

const HighIncidentSummaryForm = () => {
  const report = useAppSelector(
    (state) => state.monthlyReport?.high_incident_summary.data
  );
  const dispatch = useAppDispatch();
  const handleChange = (index: number, field: string, value: string) => {
    dispatch(updateHISIncident({ index, field, value }));
  };

  const handleRemove = (index: number) => {
    dispatch(removeHISIncident(index));
  };

  const handleAdd = () => {
    dispatch(addHISIncident());
  };
  return (
    <Grid container spacing={3} p={2}>
      {report.map((item, i) => (
        <Grid container item xs={12} alignItems="center" key={i}>
          <Grid container item xs={11} spacing={2} alignItems="center">
            <Grid item xs={6}>
              <TextField
                label="Priority"
                variant="outlined"
                value={item.priority}
                onChange={(e) => handleChange(i, "priority", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Incident Title"
                variant="outlined"
                value={item.incident_title}
                onChange={(e) =>
                  handleChange(i, "incident_title", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Overview"
                variant="outlined"
                value={item.findings.overview}
                onChange={(e) =>
                  handleChange(i, "findings.overview", e.target.value)
                }
                fullWidth
                multiline
                rows={3}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Endpoint Host Name"
                variant="outlined"
                value={item.findings.endpoint_host_name}
                onChange={(e) =>
                  handleChange(i, "findings.endpoint_host_name", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Detected By"
                variant="outlined"
                value={item.findings.detected_by}
                onChange={(e) =>
                  handleChange(i, "findings.detected_by", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Action Performed"
                variant="outlined"
                value={item.findings.action_performed}
                onChange={(e) =>
                  handleChange(i, "findings.action_performed", e.target.value)
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
              onClick={() => handleRemove(i)}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default HighIncidentSummaryForm;
