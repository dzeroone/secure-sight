import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import {
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import {
  addEQSRSN,
  removeEQSRSN,
  updateEQSChartColor,
  updateEQSChartData,
  updateEQSRSN,
  updateEQSRSNKey,
  updateEQSSenderReceipts,
  updateEQSThreatType,
  updateEQSVisibility,
} from "@@/lib/features/monthly-report/monthlySlice";
import { MuiColorInput } from "mui-color-input";
import { EmailThreatType } from "@@/types/types";

const EmailQuarantineSummaryForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.email_quarantine_summary_cas
  );

  const dispatch = useAppDispatch();

  const handleChartDataChange = (index: number, value: number) => {
    dispatch(updateEQSChartData({ index, value }));
  };

  const handleChartColorChange = (color: string) => {
    dispatch(updateEQSChartColor(color));
  };

  const handleChangeTable = (field: "sender" | "receipt", value: string) => {
    dispatch(
      updateEQSSenderReceipts({
        field,
        value,
      })
    );
  };

  const handleChangeThreatType = (
    field: keyof EmailThreatType,
    value: string
  ) => {
    dispatch(updateEQSThreatType({ field, value: Number(value) }));
  };
  const handleRSNChange = (index: number, value: string) => {
    dispatch(updateEQSRSN({ index, value }));
  };

  const handleAddRSN = () => {
    dispatch(addEQSRSN());
  };

  const handleRemoveRSN = (index: number) => {
    dispatch(removeEQSRSN(index));
  };

  const handleRSNKeyChange = (value: string) => {
    dispatch(updateEQSRSNKey(value));
  };

  const handleVisibilityChange = (value: boolean) => {
    dispatch(updateEQSVisibility(value));
  };

  return (
    <Grid container spacing={3} p={3}>
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
          <h3>Email Summary Status Chart</h3>
        </Grid>
        {data.status_chart.key.map((label, index) => (
          <Grid item xs={6} key={index}>
            <TextField
              label={label}
              variant="outlined"
              value={data.status_chart.datasets[0].data[index]}
              type="number"
              onChange={(e) =>
                handleChartDataChange(index, Number(e.target.value))
              }
              fullWidth
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <MuiColorInput
            value={data.status_chart.datasets[0].backgroundColor}
            onChange={(color) => handleChartColorChange(color)}
            fullWidth
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid container item spacing={2} xs={12}>
        <Grid item xs={12}>
          <h3>Top 03 Sender and Receipts</h3>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Top 03 Sender"
            value={data.sender_receipts.sender}
            onChange={(e) => handleChangeTable("sender", e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Top 03 Receipts"
            value={data.sender_receipts.receipt}
            onChange={(e) => handleChangeTable("receipt", e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Divider />
      </Grid>

      <Grid item xs={12}>
        <h3>Threat Type</h3>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Malicious Files"
              value={data.threat_type.malicious_files}
              onChange={(e) =>
                handleChangeThreatType("malicious_files", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Malicious URLs"
              value={data.threat_type.malicious_urls}
              onChange={(e) =>
                handleChangeThreatType("malicious_urls", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Phishing"
              value={data.threat_type.phishing}
              onChange={(e) =>
                handleChangeThreatType("phishing", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Spoofing"
              value={data.threat_type.spoofing}
              onChange={(e) =>
                handleChangeThreatType("spoofing", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Suspicious Objects"
              value={data.threat_type.suspicious_objects}
              onChange={(e) =>
                handleChangeThreatType("suspicious_objects", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Blocked Objects"
              value={data.threat_type.blocked_objects}
              onChange={(e) =>
                handleChangeThreatType("blocked_objects", e.target.value)
              }
              fullWidth
            />
          </Grid>
        </Grid>
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

export default EmailQuarantineSummaryForm;
