import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root")!;
const app = (
  <HelmetProvider>
    <App />
  </HelmetProvider>
);

// The build prerenders static HTML into #root purely so crawlers receive real
// content. We do NOT hydrate it: framer-motion entrance / whileInView animations
// make the client's first render differ from the prerendered DOM, which caused a
// React 18 hydration mismatch that left the page tail (a second footer + CTA +
// cards) orphaned in <body>. createRoot clears any prerendered content and mounts
// one clean client tree, so JS-capable clients never see the duplicate while
// crawlers still get the static HTML.
createRoot(rootElement).render(app);
