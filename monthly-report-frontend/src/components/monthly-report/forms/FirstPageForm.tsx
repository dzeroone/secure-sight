import { firstPage } from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Grid, TextField } from "@mui/material";

const FirstPageForm = () => {
  const report = useAppSelector((state) => state.monthlyReport.monthly_report);
  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string) => {
    dispatch(firstPage({ ...report, [field]: value }));
  };
  const handleCustomerNameChange = (value: string) => {
    dispatch(firstPage({ ...report, customer_name: value }));
  };
  return (
    <Grid container xs={12} rowSpacing={3} p={2}>
      <Grid item xs={12}>
        <TextField
          label="Document title"
          variant="outlined"
          value={report.doc_title}
          onChange={(e) => handleChange("doc_title", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Client Name"
          variant="outlined"
          value={report.client_name}
          onChange={(e) => handleChange("client_name", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <TextField
          label="Date and Month"
          variant="outlined"
          value={report.date}
          onChange={(e) => handleChange("date", e.target.value)}
          fullWidth
        />
      </Grid>
      <Grid item xs={12}>
        <p>Customer name for incident summary</p>
        <TextField
          label="Customer Name"
          variant="outlined"
          value={report.customer_name}
          onChange={(e) => handleCustomerNameChange(e.target.value)}
          fullWidth
        />
      </Grid>
    </Grid>
  );
};

export default FirstPageForm;
