import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Button,
  FormControl,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { MouseEventHandler } from "react";

interface MonthlyFormStepperProps {
  activeStep: number;
  totalStep: number;
  handleBack: (e: any) => void;
  handleNext: (e: any) => void;
  onChangeStep: (e: SelectChangeEvent<number>) => void;
}

export default function MonthlyFormStepper({
  activeStep,
  totalStep,
  handleBack,
  handleNext,
  onChangeStep,
}: MonthlyFormStepperProps) {
  return (
    <Stack
      component={Paper}
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      elevation={0}
      p={1}
    >
      <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
        <KeyboardArrowLeft sx={{ width: "1em", height: "1em" }} />
        Back
      </Button>
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <FormControl size="small">
          <Select value={activeStep} onChange={onChangeStep}>
            {Array.from({ length: totalStep }).map((_, i: number) => {
              return (
                <MenuItem value={i} key={i}>
                  {i + 1}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>{" "}
        / {totalStep}
      </Stack>
      <Button
        size="small"
        onClick={handleNext}
        disabled={activeStep === totalStep - 1}
      >
        Next
        <KeyboardArrowRight />
      </Button>
    </Stack>
  );
}
