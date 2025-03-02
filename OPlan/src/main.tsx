import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import AppContextProvider from "./state/AppContext.tsx";

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <AppContextProvider>
    <App />
  </AppContextProvider>
  // </StrictMode>
);
