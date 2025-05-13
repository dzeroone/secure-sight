/* eslint-disable @next/next/no-img-element */
import Bg from "@@/assets/images/monthly-report/first-page-bg.jpg";
import { useAppSelector } from "@@/lib/hooks";

const FirstPage = () => {
  const data = useAppSelector((state) => state.monthlyReport.monthly_report);
  return (
    <div
      id="first_page"
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        marginBottom: 80,
      }}
    >
      <img
        style={{ objectFit: "cover", maxWidth: "100%" }}
        src={Bg.src}
        alt=""
      />
      <div
        style={{
          position: "absolute",
          marginLeft: 120,
          marginTop: 320,
          top: 0,
          left: 0,
          bottom: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "start",
          alignItems: "start",
          color: "white",
          textAlign: "start",
        }}
      >
        <div
          style={{
            fontSize: "6rem",
            fontWeight: 700,
            marginBottom: 40,
            textAlign: "start",
          }}
        >
          {data.doc_title}
        </div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
            gap: 500,
          }}
        >
          <p style={{ margin: 0, fontSize: "1.8rem" }}>{data.date}</p>
          <p style={{ margin: 0, fontSize: "1.8rem" }}>{data.client_name}</p>
        </div>
      </div>
    </div>
  );
};

export default FirstPage;
