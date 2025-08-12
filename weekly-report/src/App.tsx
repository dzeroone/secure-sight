import { BrowserRouter } from "react-router-dom";
import Router from "./routes/router";
import {
  Chart,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import Providers from "./providers";
import { gracefulStringWrap } from "./utils/helpers";

function App() {
  Chart.register(
    ArcElement,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartDataLabels
  );
  Chart.register({
    id: "LabelSplit",
    beforeLayout: function (chart) {
      const config = chart.config as any
      // console.log(config.type)
      if(config.type != "bar") {
        // console.log('skkk')
        return
      }
      chart.data?.labels?.forEach(function (label, i, labelArr) {
        if (typeof label == "string" && label.length > 15) {
          let splitLength = Math.ceil(label.length/2)
          labelArr[i] = gracefulStringWrap(label, splitLength);
        }
      });
    },
  });

  Chart.defaults.scales.linear.grace = "5%";
  
  return (
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <Providers>
        <Router />
      </Providers>
    </BrowserRouter>
  );
}

export default App;
