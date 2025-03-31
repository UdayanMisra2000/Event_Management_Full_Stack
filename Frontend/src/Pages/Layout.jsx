import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div style={{ display: "flex", minHeight: "100vh",  backgroundColor: "#f5f5f5" }}>
      <Navbar />
      <div style={{ flex: 1, marginLeft: "220px", padding: "1rem" }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
