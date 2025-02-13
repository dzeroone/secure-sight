"use client";
import Navbar from "@@/components/common/Navbar";
import { AppStore, makeStore } from "@@/lib/store";
import { useRef } from "react";
import { Provider } from "react-redux";
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

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const storeRef = useRef<AppStore>();
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
  return (
    <Provider store={storeRef.current}>
      <Navbar>{children}</Navbar>
    </Provider>
  );
}
