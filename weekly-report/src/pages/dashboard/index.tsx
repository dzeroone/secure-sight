import { enqueueSnackbar } from "notistack";
import { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { GrFormPrevious } from "react-icons/gr";
import {
  MdDownload,
  MdOutlineNavigateNext,
  MdSave,
  MdUpload,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick-theme.css";
import "slick-carousel/slick/slick.css";
import AlcForm from "../../components/form/AlcForm";
import EndpointProtectionForm from "../../components/form/EndpointProtectionForm";
import EpiForm from "../../components/form/EpiForm";
import { LicenseForm, ProductForm } from "../../components/form/EpiTableForm";
import FirstPageForm from "../../components/form/FirstPageForm";
import KfaForm from "../../components/form/KfaForm";
import KfdForm from "../../components/form/KfdForm";
import KfwForm from "../../components/form/KfwForm";
import PisForm from "../../components/form/PisForm";
import SloForm from "../../components/form/SloFrom";
import TisForm from "../../components/form/TisForm";
import Navbar from "../../components/Navbar";
import EndpointInventory from "../../components/pdf-components/EndpointInventory";
import ExecutiveSummary from "../../components/pdf-components/ExecutiveSummary";
import FirstPage from "../../components/pdf-components/FirstPage";
import KeyFeatureApex from "../../components/pdf-components/KeyFeatureApex";
import KeyFeatureDeepSecurity from "../../components/pdf-components/KeyFeatureDeepSecurity";
import KeyFeatureWorkLoad from "../../components/pdf-components/KeyFeatureWorkLoad";
import PendingIncidentsSummary from "../../components/pdf-components/PendingIncidentsSummary";
import SloSummary from "../../components/pdf-components/SloSummary";
import TableOfContents from "../../components/pdf-components/TableOfContents";
import ThreatIntelSummary from "../../components/pdf-components/ThreatIntelSummary";
import store, { RootState } from "../../store/store";

const Dashboard = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isPreparingPdf, setIsPreparingPdf] = useState<boolean>(false);

  const router = useNavigate();

  const [searchParams] = useSearchParams();
  const elasticIndex = searchParams.get("index");
  const reportId = searchParams.get("id");

  // Get visibility status from Redux
  const formVisible = useSelector((state: RootState) => state.kfd.visible);
  const formVisible2 = useSelector((state: RootState) => state.kfw.visible);
  const formVisible3 = useSelector((state: RootState) => state.kfa.visible);
  const dispatch = useDispatch();
  const sliderRef = useRef<Slider>(null);

  const alc = useSelector((state: RootState) => state.alc);
  const tis = useSelector((state: RootState) => state.tis);
  const pis = useSelector((state: RootState) => state.pis);
  const epi = useSelector((state: RootState) => state.epi);
  const kfa = useSelector((state: RootState) => state.kfa);
  const kfw = useSelector((state: RootState) => state.kfw);
  const kfd = useSelector((state: RootState) => state.kfd);
  const slo = useSelector((state: RootState) => state.slo);
  const endPointProtection = useSelector(
    (state: RootState) => state.endPointProtection
  );
  const endPointSensor = useSelector(
    (state: RootState) => state.endPointSensor
  );
  const topIncidents = useSelector((state: RootState) => state.topIncidents);
  const incidentsSummary = useSelector(
    (state: RootState) => state.incidentsSummary
  );
  const incidentSummaryStatus = useSelector(
    (state: RootState) => state.incidentSummaryStatus
  );
  const incidentSummarySeverity = useSelector(
    (state: RootState) => state.incidentSummarySeverity
  );

  /**
   * get report data from elastic index
   */

  const getElasticData = useCallback(async () => {
    try {
      if (reportId) {
        setLoading(true);

        const res = await fetch(
          `${process.env.REACT_APP_SECURE_SITE_API_BASE}/elastic/weekly-report-form/${reportId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (res.ok) {
          const responseData = await res.json();
          // if(Array.isArray(responseData) && responseData.length > 0) {
          //   const data = responseData[0]._source

          dispatch({
            type: "RESTORE",
            payload: responseData._source.formData,
          });
          setReportData(responseData._source.reportData);
          // }
        } else {
          const errorMessage = await res.text();
          throw new Error(errorMessage);
        }
      } else if (elasticIndex) {
        setLoading(true);
        let payload = {
          index: elasticIndex,
          column: [],
        };
        const res = await fetch(
          `${process.env.REACT_APP_SECURE_SITE_API_BASE}/elastic/data/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (res.ok) {
          const responseData = await res.json();
          if (Array.isArray(responseData) && responseData.length > 0) {
            const data = responseData[0]._source;

            setReportData(data);
          }
        } else {
          const errorMessage = await res.text();
          throw new Error(errorMessage);
        }
      } else {
        dispatch({
          type: "RESET",
        });
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  }, [elasticIndex, reportId, dispatch]);

  // - end

  const handlePrint = () => {
    setIsPreparingPdf(true);
    setTimeout(() => {
      window.print();
      setIsPreparingPdf(false);
    }, 1000);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile || null);
  };

  const handleFileRead = (event: ProgressEvent<FileReader>) => {
    if (event.target?.result) {
      try {
        const json = JSON.parse(event.target.result as string);
        setReportData(json);
        setError("");
      } catch (e) {
        console.error("JSON parse error: ", e);
        setError("Failed to parse JSON file. Please check the file format.");
      }
      setLoading(false);
    }
  };

  const saveReport = async () => {
    try {
      setLoading(true);
      let url = `${process.env.REACT_APP_SECURE_SITE_API_BASE}/elastic/weekly-report-form`;
      let requestMethod = "POST";
      if (reportId) {
        url = `${process.env.REACT_APP_SECURE_SITE_API_BASE}/elastic/weekly-report-form/${reportId}`;
        requestMethod = "PATCH";
      }
      const res = await fetch(url, {
        method: requestMethod,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          formData: store.getState(),
          reportData,
        }),
      });
      if (res.ok) {
        const responseData = await res.json();
        enqueueSnackbar("Report has been saved", {
          variant: "success",
        });
        router(`/dashboard?id=${responseData._id}`, {
          replace: true,
        });
      } else {
        const errorMessage = await res.text();
        throw new Error(errorMessage);
      }
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (file) {
      setLoading(true);
      setError("");
      const reader = new FileReader();
      reader.onload = handleFileRead;
      reader.onerror = () => {
        setError("Failed to read file.");
        setLoading(false);
      };
      reader.readAsText(file);
    }
  }, [file]);

  useEffect(() => {
    getElasticData();
  }, [getElasticData]);

  const formData = {
    key: alc.key,
    data: alc.data[alc.key],
  };

  const formData2 = {
    key: tis.key,
    data: tis.data[tis.key],
  };

  const formData3 = {
    key: pis.key,
    data: pis.data[pis.key],
  };

  const formData4 = {
    key: epi.key,
    data: epi.data[epi.key],
  };

  const formData9 = {
    key: endPointProtection.key,
    data: endPointProtection.data[endPointProtection.key],
  };

  const formData10 = {
    key: endPointSensor.key,
    data: endPointSensor.data[endPointSensor.key],
  };

  const formData5 = {
    key: kfa.key,
    data: kfa.data[kfa.key],
  };

  const formData6 = {
    key: kfw.key,
    data: kfw.data[kfw.key],
  };

  const formData7 = {
    key: kfd.key,
    data: kfd.data[kfd.key],
  };

  const formData8 = {
    key: slo.key,
  };

  const formData11 = {
    key: topIncidents.key,
    data: topIncidents.data[topIncidents.key],
  };

  const formData12 = {
    key: incidentsSummary.key,
    data: incidentsSummary.data[incidentsSummary.key],
  };

  const formData13 = {
    key: incidentSummaryStatus.key,
    data: incidentSummaryStatus.data[incidentSummaryStatus.key],
  };

  const formData14 = {
    key: incidentSummarySeverity.key,
    data: incidentSummarySeverity.data[incidentSummarySeverity.key],
  };

  const clientName = useSelector((state: RootState) => state.client.clientName);

  const handleNext = () => {
    sliderRef.current?.slickNext();
  };

  const handlePrev = () => {
    sliderRef.current?.slickPrev();
  };

  const sliderSettings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  return (
    <div className="w-full">
      <Navbar />
      <div className="print-action">
        {reportData ? (
          <button
            className="btn-primary rounded-md inline-flex items-center"
            onClick={saveReport}
          >
            <MdSave className="mr-2" /> Save report
          </button>
        ) : null}
        <form>
          <label
            htmlFor="file"
            className="btn-primary rounded-md inline-flex items-center"
          >
            <MdUpload className="mr-2" /> Upload JSON file
            <input
              type="file"
              id="file"
              name="file"
              accept=".json"
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
        </form>
        {reportData && (
          <button
            className="btn-primary rounded-md inline-flex items-center"
            onClick={handlePrint}
          >
            <MdDownload className="mr-2" /> Download Pdf
          </button>
        )}
      </div>
      {loading && (
        <div className="w-full h-screen grid place-items-center">
          <div className="lds-ring">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        </div>
      )}
      {error && <div className="container">{error}</div>}

      {reportData && (
        <div className="">
          <div className="flex">
            <div className="sticky top-0 flex flex-col gap-4 max-h-screen overflow-auto max-w-[450px]">
              {!isPreparingPdf && (
                <div className="ml-[50px]">
                  <div className="flex justify-between my-4 sticky top-2 z-50 bg-white">
                    <button
                      onClick={handlePrev}
                      className="border flex items-center justify-center border-gray-300 rounded-md p-2 text-sm font-semibold"
                    >
                      <GrFormPrevious />
                      Previous
                    </button>
                    <button
                      onClick={handleNext}
                      className="border border-gray-300 flex items-center justify-center rounded-md p-2 text-sm font-semibold"
                    >
                      Next
                      <MdOutlineNavigateNext />
                    </button>
                  </div>

                  <Slider {...sliderSettings} ref={sliderRef}>
                    <div>
                      <FirstPageForm />
                    </div>
                    <div>
                      <AlcForm />
                    </div>
                    <div>
                      <EndpointProtectionForm />
                    </div>
                    <div>
                      <TisForm />
                    </div>
                    <div>
                      <PisForm />
                    </div>
                    <div>
                      <SloForm />
                    </div>
                    <div>
                      <EpiForm />
                    </div>
                    <div>
                      <LicenseForm />
                    </div>
                    <div>
                      <ProductForm />
                    </div>
                    <div>
                      <KfaForm />
                    </div>
                    <div>
                      <KfwForm />
                    </div>
                    <div>
                      <KfdForm />
                    </div>
                  </Slider>
                </div>
              )}
            </div>

            <div className="print-section">
              {/* First page */}
              {reportData?.WEEKLY_REPORT && (
                <FirstPage
                  data={reportData.WEEKLY_REPORT}
                  clientName={clientName}
                />
              )}

              {/* Table of contents */}
              {reportData?.TABLE_OF_CONTENTS && (
                <TableOfContents data={reportData.TABLE_OF_CONTENTS} />
              )}

              {/* Executive summary */}
              {reportData?.EXECUTIVE_SUMMARY && (
                <ExecutiveSummary
                  data={reportData.EXECUTIVE_SUMMARY}
                  formData={formData}
                  formData2={formData9}
                  formData3={formData10}
                />
              )}

              {/* Threat intel summary */}
              {reportData?.THREAT_INTEL_SUMMARY && (
                <ThreatIntelSummary
                  formData={formData2}
                  formData2={formData11}
                  formData3={formData12}
                  formData4={formData13}
                  formData5={formData14}
                  data={reportData.THREAT_INTEL_SUMMARY}
                />
              )}

              {/* Pending incidents summary */}
              {reportData?.PENDING_INCIDENTS_SUMMARY && (
                <PendingIncidentsSummary
                  formData={formData3}
                  data={reportData.PENDING_INCIDENTS_SUMMARY}
                />
              )}

              {/* SLO summary */}
              {reportData?.SLO_SUMMARY && (
                <SloSummary
                  formData={formData8}
                  data={reportData.SLO_SUMMARY}
                />
              )}

              {/* Endpoint inventory */}
              {reportData?.ENDPOINT_INVENTORY && (
                <EndpointInventory
                  formData={{ key: epi.key, data: epi.data[epi.key] }}
                  data={reportData.ENDPOINT_INVENTORY}
                />
              )}

              {/* Key feature apex one */}
              {reportData?.Key_feature_adoption_rate_of_Ap && formVisible3 && (
                <KeyFeatureApex
                  formData={formData5}
                  data={reportData.Key_feature_adoption_rate_of_Ap}
                />
              )}

              {/* Key feature workload */}
              {reportData?.Key_feature_adoption_rate_of_Cw && formVisible2 && (
                <KeyFeatureWorkLoad
                  formData={formData6}
                  data={reportData.Key_feature_adoption_rate_of_Cw}
                />
              )}

              {/* Key feature deep security */}
              {reportData?.Key_feature_adoption_rate_of_Ds && formVisible && (
                <KeyFeatureDeepSecurity
                  formData={formData7}
                  data={reportData.Key_feature_adoption_rate_of_Ds}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
