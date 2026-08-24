import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import Page from "./components/page";
createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
