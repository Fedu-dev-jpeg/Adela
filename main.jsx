import React from "react";
import ReactDOM from "react-dom/client";
import LitCafeFrontpage from "./LitCafeFrontpage.jsx";
import LitCafeDashboard from "./LitCafeDashboard.jsx";

function AppRouter() {
  const path = window.location.pathname.toLowerCase();
  if (path === "/dashboard" || path.startsWith("/dashboard/")) {
    return <LitCafeDashboard />;
  }
  return <LitCafeFrontpage />;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>,
);
