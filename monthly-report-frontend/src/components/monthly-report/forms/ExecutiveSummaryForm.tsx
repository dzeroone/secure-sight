import React, { Fragment } from "react";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Divider, Grid, TextField } from "@mui/material";
import {
  updateESField,
  updateESDataField,
  updateESSubField,
} from "@@/lib/features/monthly-report/monthlySlice";

const ExecutiveSummaryForm = () => {
  const report = useAppSelector(
    (state) => state.monthlyReport.executive_summary
  );
  const dispatch = useAppDispatch();

  const handleChange = (field: string, value: string) => {
    dispatch(updateESField({ field, value }));
  };

  const handleDataChange = (index: number, field: string, value: string) => {
    dispatch(updateESDataField({ index, field, value }));
  };

  const handleSubDataChange = (
    index: number,
    subIndex: number,
    field: string,
    value: string
  ) => {
    dispatch(updateESSubField({ index, subIndex, field, value }));
  };

  return (
    <Grid container spacing={3} p={2}>
      <Grid item xs={12}>
        <TextField
          label="Date"
          variant="outlined"
          value={report.date}
          onChange={(e) => handleChange("date", e.target.value)}
          fullWidth
        />
      </Grid>
      {report.data.map((item, i) => (
        <Fragment key={i}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Title"
                  variant="outlined"
                  value={item.title}
                  onChange={(e) => handleDataChange(i, "title", e.target.value)}
                  fullWidth
                />
              </Grid>
              {item.desc != null && (
                <Grid item xs={12}>
                  <TextField
                    label="Description"
                    variant="outlined"
                    value={item.desc}
                    onChange={(e) => handleDataChange(i, "desc", e.target.value)}
                    minRows={3}
                    multiline
                    fullWidth
                  />
                </Grid>
              )}
              {item.sub?.map((subItem, j) => (
                <Grid item xs={12} mt={2} key={j}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        label={`Sub Item ${j + 1} Title`}
                        variant="outlined"
                        value={subItem.title}
                        onChange={(e) =>
                          handleSubDataChange(i, j, "title", e.target.value)
                        }
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        label={`Sub Item ${j + 1} Description`}
                        variant="outlined"
                        value={subItem.desc}
                        onChange={(e) =>
                          handleSubDataChange(i, j, "desc", e.target.value)
                        }
                        minRows={3}
                        multiline
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </Grid>
              ))}
            </Grid>
          </Grid>
          {i != report.data.length - 1 ? <Grid item xs={12}><Divider /></Grid> : null}
        </Fragment>
      ))}
    </Grid>
  );
};

export default ExecutiveSummaryForm;
