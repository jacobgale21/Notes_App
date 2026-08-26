import { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import "@xyflow/react/dist/style.css";
import NavBar from "./components/UI/navBar";
import Page from "./components/pages/page";
import { GraphView } from "./components/pages/graph";
import { computerArchitecture } from "./data/placeholder";
import Home from "./components/pages/home";
import Dashboard from "./components/pages/dashboard";
import Signup from "./components/pages/signup";
import Login from "./components/pages/login";
import ProtectedRoute from "./protectedRoute";
import { refresh } from "./api";
import { setAccessToken } from "./auth";
// 1. Create a main App component
function App() {
  useEffect(() => {
    refresh().catch(() => setAccessToken(null));
  }, []);

  return (
    <Routes>
      <Route element={<NavBar />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/upload" element={<Page />} />
          <Route
            path="/graph"
            element={<GraphView graph={computerArchitecture} />}
          />
        </Route>
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
      </Route>
    </Routes>
  );
}

// 2. Render the App component
createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
