"use client";

import {
  Archive,
  DeleteOutline,
  Edit,
  Message,
  Search,
} from "@mui/icons-material";
import {
  Badge,
  Box,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  LinearProgress,
  Pagination,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { formatRelative } from "date-fns/fp";
import { useConfirm } from "material-ui-confirm";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useMemo, useState } from "react";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import Link from "next/link";
import axiosApi from "@@/config/axios";
import {
  getErrorMessage,
  getReportAuditStatusTitle,
  getReportStatusTitle,
} from "@@/helper/helper";
import { useAuth } from "@@/providers/AuthProvider";
import { ROLES } from "@@/constants";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Stack direction={"row"} sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <Pagination
        count={Math.ceil(count / rowsPerPage)}
        page={page + 1}
        hideNextButton={true}
        hidePrevButton={true}
        onChange={(e: any, p) => {
          onPageChange(e, p - 1);
        }}
        sx={{
          display: "inline-flex",
        }}
      />
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Stack>
  );
}

export default function Page() {
  const confirm = useConfirm();

  const {currentUser} = useAuth()
  const [report, setReport] = useState<{ count: number; data: any[] }>({
    count: 0,
    data: [],
  });
  const [page, setPage] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [invokeSearch, setInvokeSearch] = useState(0);

  const getReports = useCallback(async () => {
    try {
      setProcessing(true);
      const res = await axiosApi.get("/assignment-reports/monthly", {
        params: {
          page: page + 1,
          search: searchText,
        },
        responseType: "json",
      });
      setReport({
        count: res.data.count,
        data: res.data.data,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setProcessing(false);
    }
  }, [page, invokeSearch]);

  const handleReportArchive = async (report: any) => {
    try {
      setProcessing(true);
      const { confirmed } = await confirm({
        title: "Are you sure?",
        description: "You are going to archive this report.",
      });

      if (confirmed) {
        try {
          const res = await axiosApi.patch(
            `/assignment-reports/monthly/${report._id}/archive`,
            {
              responseType: "json"
            }
          );

          if (res) {
            enqueueSnackbar("Report has been archived", {
              variant: "success",
            });
            setTimeout(() => {
              getReports();
            }, 1000);
          }
        } catch (e) {
          const msg = getErrorMessage(e)
          enqueueSnackbar(msg, {
            variant: "error",
          });
        }
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      setProcessing(false);
    }
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPage(0);
    setInvokeSearch(Math.random());
  };

  const relativeFromToday = useMemo(() => {
    return formatRelative(new Date());
  }, []);

  const formatSavedDate = useCallback(
    (date: string) => {
      return relativeFromToday(date);
    },
    [relativeFromToday]
  );

  useEffect(() => {
    getReports();
  }, [getReports]);

  return (
    <Paper sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5" component="h1">
          List of saved monthly reports
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            placeholder="Search here..."
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton edge="end" type="submit">
                    <Search />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </form>
      </Stack>
      <Divider sx={{ my: 1 }} />
      {processing ? <LinearProgress /> : null}
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Client</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Saved at</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {report.data.map((report) => {
              return (
                <TableRow key={report._id}>
                  <TableCell>
                    {report.data.monthly_report.client_name}
                  </TableCell>
                  <TableCell>{report.data.monthly_report.date}</TableCell>
                  <TableCell>{formatSavedDate(report.cAt)}</TableCell>
                  <TableCell>
                    {[
                      getReportStatusTitle(report.status),
                      getReportAuditStatusTitle(report.auditStatus),
                    ]
                      .filter((s) => s)
                      .map((s) => {
                        return <Chip key={s} label={s} sx={{ mr: 1 }} />;
                      })}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" gap={2}>
                      <IconButton
                        LinkComponent={Link}
                        edge="end"
                        href={`/dashboard/monthly-report?id=${report._id}`}
                      >
                        <Edit />
                      </IconButton>
                      {currentUser?.role == ROLES.LEVEL3 ? (
                        <IconButton
                          edge="end"
                          onClick={() => handleReportArchive(report)}
                        >
                          <Archive />
                        </IconButton>
                      ) : null}
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                colSpan={5}
                rowsPerPageOptions={[20]}
                page={page}
                rowsPerPage={20}
                count={report.count}
                onPageChange={(_, v) => {
                  setPage(v);
                }}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Paper>
  );
}
