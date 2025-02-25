import moment from "moment";
import BgMain from "../../assets/images/bg-main.png";
import Bg from "../../assets/images/bg.png";
import EventusLogo from "../../assets/images/eventus.png";
import TrendMicroLogo from "../../assets/images/trend-micro.png";

interface Props {
  data: any;
  clientName: string;
}

const FirstPage = ({ data, clientName }: Props) => {
  return (
    <>
      <div
        className="bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: `url(${BgMain})` }}
      >
        <div className="first-page__bg">
          <img src={Bg} alt="" />
        </div>
        <div className="first-page">
          <div className="w-full flex flex-row flex-nowrap justify-between items-center">
            <img src={EventusLogo} className="brand-logo" alt="" />
            <img src={TrendMicroLogo} className="brand-logo" alt="" />
          </div>
          <div className="page-title">
            <h4>SOCaaS</h4>
            <h2>
              WEEKLY <br /> REPORT
            </h2>
          </div>
          <div className="client-detail">
            <h3>{clientName}</h3>
            <p>
              {moment(data?.start_date).format("Do MMMM YYYY")} to <br />{" "}
              {moment(data?.end_date).format("Do MMMM YYYY")}
            </p>
          </div>
        </div>
      </div>
      {/* <div
        className="blank-page"
        style={{ height: `${1123 * data?.blank ?? 0}px` }}
      ></div> */}
    </>
  );
};

export default FirstPage;
