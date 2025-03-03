import * as React from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import { Provider as NiceModalProvider } from "@ebay/nice-modal-react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import BrainzPlayer from "../common/brainzplayer/BrainzPlayer";
import ProtectedRoutes from "../utils/ProtectedRoutes";

export default function Layout({
  children,
  withProtectedRoutes,
}: {
  children?: React.ReactNode;
  withProtectedRoutes?: boolean;
}) {
  return (
    <NiceModalProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnHover
        theme="light"
      />
      <ScrollRestoration />
      <Navbar />
      <div className="container-react">
        <div className="container-react-main">
          {!withProtectedRoutes && <Outlet />}
          {children}
          {withProtectedRoutes && <ProtectedRoutes />}
          <BrainzPlayer />
        </div>
        <Footer />
      </div>
    </NiceModalProvider>
  );
}
