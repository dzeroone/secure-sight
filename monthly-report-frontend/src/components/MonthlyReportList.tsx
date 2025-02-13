import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Pagination } from "@mui/material";
import { getAllMonthlyReports } from "@@/services/monthly-report";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const MonthlyReportTable = () => {
  const [tableData, setTableData] = useState([]);

  const getAllMonthlyReport = async () => {
    const result = await getAllMonthlyReports();
    if (!result.success) {
      toast.error("Something went wrong while fetching the data!");
    }
    setTableData(result.data);
  };
  useEffect(() => {
    getAllMonthlyReport();
  }, []);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>S. No.</StyledTableCell>
            <StyledTableCell>Document Name</StyledTableCell>
            <StyledTableCell>Client Name</StyledTableCell>
            <StyledTableCell>Action</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((item: any, i) => (
            <StyledTableRow key={item._id}>
              <StyledTableCell component="th" scope="row">
                {i + 1}
              </StyledTableCell>
              <StyledTableCell>{item.monthly_report.doc_title}</StyledTableCell>
              <StyledTableCell>
                {item.monthly_report.client_name}
              </StyledTableCell>
              <StyledTableCell align="right">{item.name}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      <Box
        sx={{
          display: "flex",
          justifyContent: { xs: "center", md: "flex-end" },
          flexShrink: 0,
          marginLeft: 2.5,
          p: 2,
        }}
      >
        {/* <Pagination count={10} /> */}
      </Box>
    </TableContainer>
  );
};

export default MonthlyReportTable;
