import {
  removeTableOfContents,
  tableOfContents,
  updateTableOfContents,
} from "@@/lib/features/monthly-report/monthlySlice";
import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Button, Grid, IconButton, TextField } from "@mui/material";
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
    <Grid container xs={12} rowSpacing={3} p={2}>
      {report.map((item, i) => (
        <Grid container item xs={12} columnSpacing={2} key={i}>
          <Grid item xs={8}>
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
          <Grid item xs={1}>
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
      <Grid item xs={12}>
        <Button variant="contained" color="primary" onClick={handleAdd}>
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default TableOfContentsForm;
