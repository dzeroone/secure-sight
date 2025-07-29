import moment from "moment";
import { enqueueSnackbar } from "notistack";
import { useCallback, useEffect, useState } from "react";
import { MdArchive, MdEdit, MdSearch } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import { confirm } from "../../utils/confirm";
import { withAuth } from "../../hocs/withAuth";
import axiosApi from "../../config/axios";
import {
  getReportAuditStatusTitle,
  getReportStatusTitle,
} from "../../utils/helpers";

function SavedReportsPage() {
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
      const res = await axiosApi(
        `/assignment-reports/weekly?page=${page + 1}&search=${searchText}`
      );
      const data = res.data;
      setReport({
        count: data.count,
        data: data.data,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setProcessing(false);
    }
  }, [page, invokeSearch]);

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setPage(0);
    setInvokeSearch(Math.random());
  };

  const handleReportDeletion = async (report: any) => {
    try {
      // setProcessing(true);
      const confirmed = await confirm({
        title: "Saved report is going to be deleted",
        confirmation: "Are you sure?",
      });

      if (confirmed) {
        try {
          const res = await fetch(
            `${process.env.REACT_APP_SECURE_SITE_API_BASE}/elastic/weekly-report-form/${report._id}`,
            {
              method: "DELETE",
            }
          );

          if (res.ok) {
            enqueueSnackbar("Report has been deleted", {
              variant: "success",
            });
            setTimeout(() => {
              getReports();
            }, 1000);
          }
        } catch (e) {
          console.log(e);
        }
      }
    } catch (e: any) {
      console.log(e);
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    getReports();
  }, [getReports]);

  return (
    <div className="w-full">
      <Navbar />
      <div className="container mx-auto p-4">
        <div>
          <div className="relative flex flex-col w-full h-full overflow-auto text-gray-700 bg-white shadow-md rounded-lg bg-clip-border">
            <table className="w-full text-left table-auto min-w-max text-slate-800">
              <thead>
                <tr>
                  <td colSpan={5} className="p-4">
                    {processing && (
                      <div className="w-full h-screen grid place-items-center">
                        <div className="lds-ring">
                          <div></div>
                          <div></div>
                          <div></div>
                          <div></div>
                        </div>
                      </div>
                    )}
                    <form onSubmit={handleSubmit} className="flex justify-end">
                      <div className="w-full max-w-sm min-w-[200px]">
                        <input
                          type="text"
                          className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded-md px-3 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-300 shadow-sm focus:shadow"
                          placeholder="Search here ..."
                          value={searchText}
                          onChange={(e) => setSearchText(e.target.value)}
                        />
                      </div>
                      <button
                        className="flex items-center rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                        type="submit"
                      >
                        <MdSearch />
                      </button>
                    </form>
                  </td>
                </tr>
                <tr className="text-slate-500 border-b border-slate-300 bg-slate-50">
                  <th className="p-4">
                    <p className="text-sm leading-none font-normal">
                      Client Name
                    </p>
                  </th>
                  <th className="p-4">
                    <p className="text-sm leading-none font-normal">
                      Start Date
                    </p>
                  </th>
                  <th className="p-4">
                    <p className="text-sm leading-none font-normal">End Date</p>
                  </th>
                  <th className="p-4">
                    <p className="text-sm leading-none font-normal">Saved At</p>
                  </th>
                  <th className="p-4">
                    <p className="text-sm leading-none font-normal">Status</p>
                  </th>
                  <th className="p-4">
                    <p></p>
                  </th>
                </tr>
              </thead>
              <tbody>
                {report.data.map((report) => {
                  return (
                    <tr className="hover:bg-slate-50" key={report._id}>
                      <td className="p-4">
                        <p className="text-sm font-bold">
                          {report.data.formData.client.clientName}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          { report?.data.formData.client.dateFrom }
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          { report?.data.formData.client.dateTo }
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {moment(report?.cAt).format("Do MMMM YYYY")}
                        </p>
                      </td>
                      <td className="p-4">
                        <p className="text-sm">
                          {[
                            getReportStatusTitle(report.status),
                            getReportAuditStatusTitle(report.auditStatus),
                          ]
                            .filter((s) => s)
                            .map((s) => {
                              return (
                                <span key={s} className="p-1 mr-1 bg-slate-400">
                                  {s}
                                </span>
                              );
                            })}
                        </p>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-row gap-2">
                          <Link
                            className="flex items-center rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            to={`/dashboard?id=${report._id}`}
                          >
                            <MdEdit />
                          </Link>
                          <button
                            className="flex items-center rounded-md bg-gradient-to-tr from-slate-800 to-slate-700 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-sm hover:shadow-lg focus:bg-slate-700 focus:shadow-none active:bg-slate-700 hover:bg-slate-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            // onClick={() => handleReportDeletion(report)}
                          >
                            <MdArchive />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={6} className="p-4">
                    <ReactPaginate
                      className="list-none flex gap-2 items-center"
                      pageLinkClassName="py-2 px-4 border rounded-lg"
                      activeLinkClassName="text-white bg-slate-400"
                      breakLabel="..."
                      nextLabel="next >"
                      onPageChange={(data) => {
                        setPage(data.selected);
                      }}
                      pageRangeDisplayed={5}
                      pageCount={Math.ceil(report.count / 20)}
                      previousLabel="< previous"
                      renderOnZeroPageCount={null}
                    />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(SavedReportsPage);
