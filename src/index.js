import { createRoot } from "react-dom/client";
import { StrictMode } from "react";
import App from "./pages/app.jsx";
import Budget from "./pages/budget/Budget.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);
