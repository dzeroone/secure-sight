"use client";
import Navbar from "@@/components/common/Navbar";
import { gracefulStringWrap } from "@@/helper/helper";
import { AppStore, makeStore } from "@@/lib/store";
import { useAuth } from "@@/providers/AuthProvider";
import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { ConfirmProvider } from "material-ui-confirm";
import { redirect } from "next/navigation";
import { SnackbarProvider } from "notistack";
import { useEffect, useRef } from "react";
import { Provider } from "react-redux";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
  const loginStateChecked = useRef(false);
  const { currentUser, loading } = useAuth();

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

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
      chart.data?.labels?.forEach(function (label, i, labelArr) {
        if (typeof label == "string" && label.length > 15) {
          labelArr[i] = gracefulStringWrap(label, 15);
        }
      });
    },
  });
  Chart.defaults.color = "#292929";
  Chart.defaults.font.size = 14;
  Chart.defaults.scales.linear.grace = "5%";
  Chart.defaults.responsive = true;
  Chart.defaults.maintainAspectRatio = false;
  Chart.defaults.plugins.tooltip.callbacks.title = function (tooltipItems) {
    const item = tooltipItems[0];
    const label = item.chart.config.data.labels?.[item.dataIndex];
    return Array.isArray(label) ? label.join(" ") : (label as string) || "";
  };

  useEffect(() => {
    if (loading) return;
    if (loginStateChecked.current) return;
    loginStateChecked.current = true;

    if (!currentUser) {
      const redirectUrl = `/?redirect_url=${encodeURIComponent(
        window.location.pathname + window.location.search
      )}`;
      redirect(redirectUrl);
    }
  }, [currentUser, loading]);

  return (
    <Provider store={storeRef.current}>
      <ConfirmProvider>
        <SnackbarProvider>
          <Navbar>{children}</Navbar>
        </SnackbarProvider>
      </ConfirmProvider>
    </Provider>
  );
}
