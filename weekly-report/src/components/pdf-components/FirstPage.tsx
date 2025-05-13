import moment from "moment";
import BgMain from "../../assets/images/bg-main.png";
import Bg from "../../assets/images/bg.png";
import EventusLogo from "../../assets/images/eventus.png";
import TrendMicroLogo from "../../assets/images/trend-micro.png";
import { ClientState } from "../../features/weekly/weeklySlice";

interface Props {
  data: any;
  client: ClientState;
}

const FirstPage = ({ data, client }: Props) => {
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
            <h4>{client.subtitle}</h4>
            <h2>
              {client.title}
            </h2>
          </div>
          <div className="client-detail">
            <h3>{client.clientName}</h3>
            <p>
              {client.dateFrom} to <br />{" "}
              {client.dateTo}
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
