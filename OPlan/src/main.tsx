import { createRoot } from "react-dom/client";
import "./index.css";
import InterApp from "./InterApp.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <InterApp />
  // </StrictMode>
);
