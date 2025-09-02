import {
  pendingIncidentsSummary,
  removePendingIncidentsSummary,
  updatePendingIncidentsSummary,
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Button, Grid, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const PendingIncidentsSummaryForm = () => {
  const report = useAppSelector(
    (state) => state.monthlyReport?.pending_incident_summary.data
  );

  const dispatch = useAppDispatch();
  const handleChange = (index: number, field: string, value: string) => {
    const updatedItem = {
      index: index,
      data: {
        ...report[index],
        [field]: value,
      },
    };
    console.log(updatedItem);
    dispatch(updatePendingIncidentsSummary(updatedItem));
  };
  const handleRemove = (i: number) => {
    dispatch(removePendingIncidentsSummary(i));
  };
  const handleAdd = () => {
    dispatch(
      pendingIncidentsSummary({
        incident_name: "",
        priority: "",
        no_of_occurrence: "",
        severity: "",
      })
    );
  };

  return (
    <Grid container xs={12} rowSpacing={3} p={2}>
      {report.map((item, i) => (
        <Grid container item xs={12} spacing={2} key={i} alignItems="center">
          <Grid container item xs={11} spacing={2}>
            <Grid item xs={6}>
              <TextField
                label="incident name"
                variant="outlined"
                value={item.incident_name}
                onChange={(e) =>
                  handleChange(i, "incident_name", e.target.value)
                }
                fullWidth
              />
            </Grid>
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
                label="No of Occurence"
                variant="outlined"
                value={item.no_of_occurrence}
                onChange={(e) =>
                  handleChange(i, "no_of_occurrence", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Severity"
                variant="outlined"
                value={item.severity}
                onChange={(e) => handleChange(i, "severity", e.target.value)}
                fullWidth
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

export default PendingIncidentsSummaryForm;
