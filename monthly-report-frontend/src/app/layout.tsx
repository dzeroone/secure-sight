import type { Metadata } from "next";
import { ToastContainer } from "react-toastify";

import "react-toastify/dist/ReactToastify.css";
import "@@/styles/style.scss";

export const metadata: Metadata = {
  title: "Eventus Report Generation",
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
        {children}
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
