"use client";
import MonthlyReportTable from "@@/components/MonthlyReportList";
import WeeklyReportTable from "@@/components/WeeklyReportList";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Grid, Tab } from "@mui/material";
import { useState } from "react";

const DashboardPage = () => {
  const [tabValue, setTabValue] = useState("2");

  const handleTabChange = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };
  return (
    <Grid container justifyContent="center">
      <Grid item xs={12} md={8}>
        <Box sx={{ width: "100%", typography: "body1" }}>
          <TabContext value={tabValue}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList
                onChange={handleTabChange}
                aria-label="lab API tabs example"
              >
                {/* <Tab label="Weekly Report" value="1" /> */}
                <Tab label="Monthly Report" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <WeeklyReportTable />
            </TabPanel>
            <TabPanel value="2">
              <MonthlyReportTable />
            </TabPanel>
          </TabContext>
        </Box>
      </Grid>
    </Grid>
  );
};

export default DashboardPage;
