"use client";

import {
  Box,
  Paper,
  styled,
  TextareaAutosize,
  Typography,
} from "@mui/material";

const blue = {
  100: "#DAECFF",
  200: "#b6daff",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  900: "#003A75",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Textarea = styled(TextareaAutosize)(
  ({ theme }) => `
    box-sizing: border-box;
    width: 320px;
    font-family: inherit;
    font-size: 0.875rem;
    font-weight: 400;
    line-height: 1.5;
    padding: 8px 12px;
    border-radius: 8px;
    color: ${theme.palette.mode === "dark" ? grey[300] : grey[900]};
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0px 2px 2px ${
      theme.palette.mode === "dark" ? grey[900] : grey[50]
    };

    &:hover {
      border-color: ${blue[400]};
    }

    &:focus {
      border-color: ${blue[400]};
      box-shadow: 0 0 0 3px ${
        theme.palette.mode === "dark" ? blue[600] : blue[200]
      };
    }

    // firefox
    &:focus-visible {
      outline: 0;
    }
  `
);

export default function Page() {
  return (
    <Paper sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column" }}>
      <Box display="flex" flexDirection="column" flex={1}>
        <Paper elevation={1} sx={{ px: 2, py: 1 }}>
          <Typography mb={1}>Report</Typography>
          <div></div>
        </Paper>
        <Box flex={1} position="relative">
          <Typography mb={1}>Messages</Typography>
          <Box></Box>
          <Textarea
            placeholder="Write your message..."
            maxRows={3}
            minRows={2}
            sx={{
              position: "absolute",
              bottom: 0,
              width: "100%",
              resize: "none",
            }}
          />
        </Box>
      </Box>
    </Paper>
  );
}
