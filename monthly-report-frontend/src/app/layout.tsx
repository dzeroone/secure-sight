import CssBaseline from "@mui/material/CssBaseline";
import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";

import "@@/styles/style.scss";
import "react-toastify/dist/ReactToastify.css";
import Providers from "@@/providers";

export const metadata: Metadata = {
  title: "Report Automation",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <CssBaseline />
        <Providers>{children}</Providers>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          draggable
          pauseOnFocusLoss
        />
      </body>
    </html>
  );
}
