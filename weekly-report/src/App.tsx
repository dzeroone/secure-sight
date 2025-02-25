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
  return (
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  );
}

export default App;
