import { useAppDispatch, useAppSelector } from "@@/lib/hooks";
import { Button, Divider, Grid, IconButton, TextField } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import { IntegrationSummary, TMProductSummary } from "@@/types/types";
import {
  addPARIntegration,
  addPARTMProduct,
  removePARIntegration,
  removePARTMProduct,
  updatePARIntegration,
  updatePARTMProduct,
} from "@@/lib/features/monthly-report/monthlySlice";

const ProductAssessmentForm = () => {
  const data = useAppSelector(
    (state) => state.monthlyReport.product_assessment_report
  );

  const dispatch = useAppDispatch();

  const handleTMProductChange = (
    index: number,
    field: keyof TMProductSummary,
    value: string
  ) => {
    dispatch(updatePARTMProduct({ index, field, value }));
  };

  const handleIntegrationChange = (
    index: number,
    field: keyof IntegrationSummary,
    value: string | number
  ) => {
    dispatch(updatePARIntegration({ index, field, value }));
  };

  const handleAddTMProduct = () => {
    dispatch(addPARTMProduct());
  };

  const handleRemoveTMProduct = (index: number) => {
    dispatch(removePARTMProduct(index));
  };

  const handleAddIntegration = () => {
    dispatch(addPARIntegration());
  };

  const handleRemoveIntegration = (index: number) => {
    dispatch(removePARIntegration(index));
  };

  return (
    <Grid container spacing={3} p={3}>
      <Grid item xs={12}>
        <h3>Products Integrated</h3>
      </Grid>
      {data.tm_products_summary.map((i, j) => (
        <Grid container item xs={12} alignItems="center" spacing={2} key={j}>
          <Grid container item xs={11} spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="TM Product"
                variant="outlined"
                value={i.tm_product}
                onChange={(e) =>
                  handleTMProductChange(j, "tm_product", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Connection status"
                variant="outlined"
                value={i.connection_status}
                onChange={(e) =>
                  handleTMProductChange(j, "connection_status", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Identifier"
                variant="outlined"
                value={i.identifier}
                onChange={(e) =>
                  handleTMProductChange(j, "identifier", e.target.value)
                }
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => handleRemoveTMProduct(j)}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Divider variant="middle" />
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddTMProduct}
        >
          Add
        </Button>
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
      <Grid item xs={12}>
        <h3>Integration Summary</h3>
      </Grid>
      {data.integration_summary.map((k, l) => (
        <Grid container item xs={12} alignItems="center" spacing={2} key={l}>
          <Grid container item xs={11} spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Product"
                variant="outlined"
                value={k.product}
                onChange={(e) =>
                  handleIntegrationChange(l, "product", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Status"
                variant="outlined"
                value={k.status}
                onChange={(e) =>
                  handleIntegrationChange(l, "status", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Product Quantity as per SOW"
                variant="outlined"
                type="number"
                value={k.product_quantity_sow}
                onChange={(e) =>
                  handleIntegrationChange(
                    l,
                    "product_quantity_sow",
                    Number(e.target.value)
                  )
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Integrated Devices / Log Receiving Status"
                variant="outlined"
                value={k.id_log_status}
                onChange={(e) =>
                  handleIntegrationChange(l, "id_log_status", e.target.value)
                }
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Data Consumption"
                variant="outlined"
                value={k.data_consumption}
                onChange={(e) =>
                  handleIntegrationChange(l, "data_consumption", e.target.value)
                }
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid item xs={1}>
            <IconButton
              aria-label="delete"
              color="primary"
              onClick={() => handleRemoveIntegration(l)}
            >
              <ClearIcon />
            </IconButton>
          </Grid>
          <Grid item xs={12}>
            <Divider variant="middle" />
          </Grid>
        </Grid>
      ))}
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleAddIntegration}
        >
          Add
        </Button>
      </Grid>
    </Grid>
  );
};

export default ProductAssessmentForm;
