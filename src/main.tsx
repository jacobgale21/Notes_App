import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./style.css";
import "@xyflow/react/dist/style.css";
import NavBar from "./components/UI/navBar";
import Page from "./components/pages/page";
import { GraphView } from "./components/pages/graph";
import { demoSections, demoRelations } from "./data/placeholder";
import Home from "./components/pages/home";
import Dashboard from "./components/pages/dashboard";
createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<NavBar />}>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Page />} />
          <Route
            path="/graph"
            element={
              <GraphView nodes={demoSections} relations={demoRelations} />
            }
          />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
