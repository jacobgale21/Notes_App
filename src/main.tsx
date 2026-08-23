import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";
import Page from "./page";
createRoot(document.querySelector("#app")!).render(
  <StrictMode>
    <Page />
  </StrictMode>,
);
