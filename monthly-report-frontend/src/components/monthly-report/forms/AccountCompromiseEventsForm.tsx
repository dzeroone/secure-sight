import { useAppSelector } from "@@/lib/hooks";
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
import { useDispatch } from "react-redux";
import ClearIcon from "@mui/icons-material/Clear";
import {
  updateACERiskEvent,
  addACERiskEvent,
  removeACERiskEvent,
  addACERSN,
  removeACERSN,
  updateACERSN,
  updateACERSNKey,
} from "@@/lib/features/monthly-report/monthlySlice";
import { ACERiskEvent } from "@@/types/types";

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

  const handleAdd = () => {
    dispatch(addACERiskEvent());
  };

  const handleRemove = (index: number) => {
    dispatch(removeACERiskEvent(index));
  };

  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateACERSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addACERSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeACERSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateACERSNKey(value));
  };
  return (
    <Grid container xs={12} rowSpacing={3} p={3}>
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
        <h3>Recommendations/Notes/Summary</h3>
      </Grid>
      <Grid item xs={12}>
        <FormControl fullWidth>
          <InputLabel id="rsn-label">Recommendations/Notes/Summary</InputLabel>
          <Select
            labelId="rsn-label"
            id="demo-simple-select"
            value={data.rsn.key}
            onChange={(e) => handleRSNKeyChange(e.target.value)}
            label="Recommendations/Notes/Summary"
          >
            <MenuItem value="Recommendations">Recommendations</MenuItem>
            <MenuItem value="Notes">Notes</MenuItem>
            <MenuItem value="Summary">Summary</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      {data.rsn.data.map((j, k) => (
        <Grid container item xs={12} alignItems="center" spacing={2} key={k}>
          <Grid item xs={10}>
            <TextField
              label="Recommendations/Notes/Summary"
              variant="outlined"
              value={j}
              rows={3}
              fullWidth
              multiline
              onChange={(e) => handleRSNChange(k, e.target.value)}
            />
          </Grid>
          <Grid item xs={2}>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => handleRemoveRSN(k)}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleAddRSN}>
          Add Note
        </Button>
      </Grid>
    </Grid>
  );
};

export default AccountCompromiseEventsForm;
