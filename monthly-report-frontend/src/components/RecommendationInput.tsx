import {
  removeReportPropArr,
  updateReportProp,
} from "@@/lib/features/monthly-report/monthlySlice";
import { RecommendationNote } from "@@/types/types";
import { Add, Clear, Delete } from "@mui/icons-material";
import {
  Button,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useConfirm } from "material-ui-confirm";
import { useDispatch } from "react-redux";

interface RecommendationInputProps {
  values: RecommendationNote[];
  entity: string;
}

export default function RecommendationInput({
  values,
  entity,
}: RecommendationInputProps) {
  const dispatch = useDispatch();
  const confirm = useConfirm();

  const onClickRemoveNote = async (index: number) => {
    try {
      const { confirmed } = await confirm({
        title: "Are you sure?",
        description: "You are going to remove this note!",
      });
      if (confirmed) {
        dispatch(
          removeReportPropArr({
            attr: `${entity}.notes`,
            index,
          })
        );
      }
    } catch (e) {}
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="h6" component="h3">
          Recommendations / Notes / Summary
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Stack direction={"column"} gap={3}>
          {values.map((v, i) => {
            return (
              <Grid container spacing={1} key={i}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="rsn-label">
                      Recommendations/Notes/Summary
                    </InputLabel>
                    <Select
                      labelId="rsn-label"
                      id="demo-simple-select"
                      value={v.key}
                      onChange={(e) =>
                        dispatch(
                          updateReportProp({
                            attr: `${entity}.notes[${i}].key`,
                            value: e.target.value,
                          })
                        )
                      }
                      label="Recommendations/Notes/Summary"
                    >
                      <MenuItem value="Recommendations">
                        Recommendations
                      </MenuItem>
                      <MenuItem value="Notes">Notes</MenuItem>
                      <MenuItem value="Summary">Summary</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <Stack direction={"column"} gap={1}>
                    {v.data.map((j, k) => (
                      <Grid container alignItems="center" key={k}>
                        <Grid item xs>
                          <TextField
                            label="Recommendations/Notes/Summary"
                            variant="outlined"
                            value={j}
                            rows={3}
                            fullWidth
                            multiline
                            onChange={(e) =>
                              dispatch(
                                updateReportProp({
                                  attr: `${entity}.notes[${i}].data[${k}]`,
                                  value: e.target.value,
                                })
                              )
                            }
                          />
                        </Grid>
                        <Grid item xs="auto">
                          <IconButton
                            aria-label="delete"
                            color="primary"
                            onClick={() =>
                              dispatch(
                                removeReportPropArr({
                                  attr: `${entity}.notes[${i}].data`,
                                  index: k,
                                })
                              )
                            }
                          >
                            <Clear />
                          </IconButton>
                        </Grid>
                      </Grid>
                    ))}
                    <Stack direction={"column"} gap={1}>
                      <div>
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() => {
                            dispatch(
                              updateReportProp({
                                attr: `${entity}.notes[${i}].data[${v.data.length}]`,
                                value: "",
                              })
                            );
                          }}
                        >
                          <Add sx={{ mr: 1 }} /> Note text
                        </Button>
                      </div>
                      <div>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          onClick={() => onClickRemoveNote(i)}
                        >
                          <Delete sx={{ mr: 1 }} /> Note
                        </Button>
                      </div>
                    </Stack>
                  </Stack>
                </Grid>
              </Grid>
            );
          })}
        </Stack>
      </Grid>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            dispatch(
              updateReportProp({
                attr: `${entity}.notes[${values.length}]`,
                value: {
                  key: "",
                  data: [""],
                },
              })
            );
          }}
        >
          Add Note
        </Button>
      </Grid>
    </Grid>
  );
}
