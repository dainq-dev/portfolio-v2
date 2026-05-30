/**
 * This file is the entry point for the React app, it sets up the root
 * element and renders the App component to the DOM.
 *
 * It is included in `src/index.html`.
 */

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { preload, preconnect } from "react-dom";
import { SpeedInsights } from "@vercel/speed-insights/react"
// ⚡ React 19 Preconnecting: Resolve web font domains early to speed up text paint
preconnect("https://fonts.googleapis.com");
preconnect("https://fonts.gstatic.com", { crossOrigin: "anonymous" });

// ⚡ React 19 Preloading: Fetch heavy 3D assets early in the background
preload("/models/character.enc", { as: "fetch", crossOrigin: "anonymous" });
preload("/draco/draco_decoder.js", { as: "script" });
preload("/draco/draco_wasm_wrapper.js", { as: "script" });
preload("/models/character.glb", { as: "fetch" });

const elem = document.getElementById("root")!;
const app = (
  <StrictMode>
    <App />
    <SpeedInsights />
  </StrictMode>
);

// https://bun.com/docs/bundler/hot-reloading#import-meta-hot-data
(import.meta.hot.data.root ??= createRoot(elem)).render(app);
