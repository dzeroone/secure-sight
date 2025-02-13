"use client";
import { updateAboutField, updateAboutChart } from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Grid, TextField } from "@mui/material";
import { MuiColorInput } from "mui-color-input";

const AboutThisReportForm = () => {
  const report = useAppSelector((state) => state.monthlyReport.about_this_report);
  const dispatch = useAppDispatch();

  const handleChange = (path: (string | number)[], value: any) => {
    dispatch(updateAboutField({ path, value }));
  };

  const handleChartChange = (index: number, field: string, value: any) => {
    const updatedChart = { ...report.chart };
    const updatedDataset = { ...updatedChart.datasets[0], [field]: value };
    updatedChart.datasets = [{ ...updatedDataset }];
    dispatch(updateAboutChart(updatedChart));
  };

  const handleColorChange = (color: string, index: number) => {
    const updatedColors = [...report.chart.datasets[0].backgroundColor];
    updatedColors[index] = color;
    handleChartChange(index, "backgroundColor", updatedColors);
  };

  const renderInputs = (data: any, path: (string | number)[] = []) => {
    return Object.keys(data).map((key) => {
      const newPath = [...path, key];
      const value = data[key];
      if (key === 'chart') {
        return null; // Skip the chart key
      } else if (typeof value === "object" && !Array.isArray(value)) {
        return (
          <Grid container item xs={12} spacing={2} key={newPath.join(".")}>
            <h3>{key}</h3>
            <Grid container item spacing={2}>{renderInputs(value, newPath)}</Grid>
          </Grid>
        );
      } else if (Array.isArray(value)) {
        return value.map((item, index) => (
          <Grid container item spacing={2} xs={12} key={index}>
            <h4>{key} - {index + 1}</h4>
            {renderInputs(item, [...newPath, index])}
          </Grid>
        ));
      } else {
        return (
          <Grid item xs={12} key={newPath.join(".")}>
            <TextField
              label={key}
              variant="outlined"
              value={value}
              onChange={(e) => handleChange(newPath, e.target.value)}
              fullWidth
              multiline={key === "desc"}
              rows={key === "desc" ? 4 : undefined}
            />
          </Grid>
        );
      }
    });
  };

  return (
    <Grid container spacing={3} p={2}>
      {renderInputs(report)}
      <Grid container item spacing={2} xs={12}>
        <h3>Chart Data</h3>
        {report.chart.datasets[0].data.map((dataPoint, i) => (
          <Grid container item spacing={2} key={i}>
            <Grid item xs={12}>
              <TextField
                label={`Label ${i + 1}`}
                variant="outlined"
                value={report.chart.datasets[0].label[i]}
                onChange={(e) => {
                  const updatedLabels = [...report.chart.datasets[0].label];
                  updatedLabels[i] = e.target.value;
                  handleChartChange(i, "label", updatedLabels);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label={`Data Point ${i + 1}`}
                variant="outlined"
                value={dataPoint}
                onChange={(e) => {
                  const updatedData = [...report.chart.datasets[0].data];
                  updatedData[i] = parseInt(e.target.value);
                  handleChartChange(i, "data", updatedData);
                }}
                fullWidth
              />
            </Grid>
            <Grid item xs={6}>
              <MuiColorInput
                label={`Color ${i + 1}`}
                value={report.chart.datasets[0].backgroundColor[i]}
                onChange={(color) => handleColorChange(color, i)}
                fullWidth
              />
            </Grid>
          </Grid>
        ))}
      </Grid>
    </Grid>
  );
};

export default AboutThisReportForm;
