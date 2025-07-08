import { ArrowDropDown, KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
import {
  Button,
  FormControl,
  Menu,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { MouseEventHandler, ReactNode, useMemo, useState } from "react";

interface MonthlyFormStepperProps {
  activeStep: number;
  steps: {
    id: string,
    label: string,
    component: ReactNode
  }[];
  handleBack: (e: any) => void;
  handleNext: (e: any) => void;
  onChangeStep: (step: number) => void;
}

export default function MonthlyFormStepper({
  activeStep,
  steps,
  handleBack,
  handleNext,
  onChangeStep,
}: MonthlyFormStepperProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const totalStep = useMemo(() => {
    return steps.length
  }, [steps])

  const handleClose = () => {
    setAnchorEl(null);
  };

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
          <Button
            id="page-list-trigger"
            aria-haspopup="listbox"
            aria-controls="page-list-menu"
            onClick={(e) => {
              setAnchorEl(e.currentTarget)
            }}
            sx={{
              py: 0,
              px: 1,
              minWidth: 0
            }}
          >
            {activeStep + 1} <ArrowDropDown />
          </Button>
          <Menu
            id="page-list-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'page-list-trigger',
              role: 'listbox',
            }}
          >
            {steps.map((step, i: number) => {
              return (
                <MenuItem
                  selected={i === activeStep}
                  onClick={(_) => onChangeStep(i)}
                  key={i}
                >
                  {String(i+1).padStart(2, '0')} - {step.label}
                </MenuItem>
              );
            })}
          </Menu>
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
