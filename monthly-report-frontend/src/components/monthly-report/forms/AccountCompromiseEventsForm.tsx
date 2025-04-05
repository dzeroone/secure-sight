import RecommendationInput from "@@/components/RecommendationInput";
import {
  addACERiskEvent,
  removeACERiskEvent,
  updateACERiskEvent,
  updateACERiskVisibility,
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppSelector } from "@@/lib/hooks";
import { ACERiskEvent } from "@@/types/types";
import ClearIcon from "@mui/icons-material/Clear";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import { useDispatch } from "react-redux";

const AccountCompromiseEventsForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.account_compromise_events
  );
  const dispatch = useDispatch();

  const handleFieldChange = (
    index: number,
    field: keyof ACERiskEvent,
    value: string
  ) => {
    dispatch(updateACERiskEvent({ index, field, value }));
  };

  const handleVisibilityChange = (value: boolean) => {
    dispatch(updateACERiskVisibility(value));
  };

  const handleAdd = () => {
    dispatch(addACERiskEvent());
  };

  const handleRemove = (index: number) => {
    dispatch(removeACERiskEvent(index));
  };

  return (
    <Grid container xs={12} rowSpacing={3} p={3}>
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
      {data.risk_event_table.map((item, i) => (
        <Grid container item xs={12} spacing={2} alignItems="center" key={i}>
          <Grid container item xs={11} spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Risk Event"
                variant="outlined"
                value={item.risk_event}
                onChange={(e) =>
                  handleFieldChange(i, "risk_event", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Assets"
                variant="outlined"
                value={item.asset}
                onChange={(e) => handleFieldChange(i, "asset", e.target.value)}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Data Source"
                variant="outlined"
                value={item.data_source}
                onChange={(e) =>
                  handleFieldChange(i, "data_source", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Event Risk"
                variant="outlined"
                value={item.event_risk}
                onChange={(e) =>
                  handleFieldChange(i, "event_risk", e.target.value)
                }
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
          <Divider />
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <RecommendationInput
          values={data.notes}
          entity="account_compromise_events"
        />
      </Grid>
    </Grid>
  );
};

export default AccountCompromiseEventsForm;
