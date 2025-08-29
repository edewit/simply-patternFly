import "@simply-patternfly/core/styles.css";

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

const storageKey = "theme-preference";

const getColorPreference = () => {
  if (localStorage.getItem(storageKey))
    return localStorage.getItem(storageKey)!;
  else
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
};

const reflectPreference = () => {
  const colorPreference = getColorPreference();
  if (colorPreference === "dark")
    document.firstElementChild?.setAttribute("class", "pf-v6-theme-dark");
};

reflectPreference();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
