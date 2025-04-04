import {
  removeTableOfContents,
  tableOfContents,
  updateTableOfContents,
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Box, Button, Grid, IconButton, Stack, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";

const TableOfContentsForm = () => {
  const report = useAppSelector(
    (state) => state.monthlyReport?.table_of_contents.data
  );
  const dispatch = useAppDispatch();
  const handleChange = (index: number, field: string, value: string) => {
    const updatedItem = {
      index: index,
      data: {
        ...report[index],
        [field]: value,
      },
    };
    dispatch(updateTableOfContents(updatedItem));
  };
  const handleRemove = (i: number) => {
    dispatch(removeTableOfContents(i));
  };
  const handleAdd = () => {
    dispatch(
      tableOfContents({
        link: "",
        page_no: "",
        title: "",
      })
    );
  };
  return (
    <Stack direction="column" gap={2} p={2}>
      {report.map((item, i) => (
        <Grid container spacing={2} key={i}>
          <Grid item xs>
            <TextField
              label="Title"
              variant="outlined"
              value={item.title}
              onChange={(e) => handleChange(i, "title", e.target.value)}
              fullWidth
            />
            <TextField
              value={item.link}
              onChange={(e) =>
                handleChange(
                  i,
                  "link",
                  e.target.value
                    .toLowerCase()
                    .replace(/[^\w\s]/g, "")
                    .replace(/\s+/g, "-")
                )
              }
              type="hidden"
              variant="filled"
            />
          </Grid>
          <Grid item xs={3}>
            <TextField
              label="Page Number"
              variant="outlined"
              value={item.page_no}
              onChange={(e) => handleChange(i, "page_no", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => handleRemove(i)}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
        </Grid>
      ))}
      <Box>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </Box>
    </Stack>
  );
};

export default TableOfContentsForm;
