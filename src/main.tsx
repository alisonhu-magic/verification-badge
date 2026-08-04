import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Studio } from "./demo/Studio";
import "./styles/fonts.css";
import "./styles/demo.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Studio />
  </StrictMode>,
);
