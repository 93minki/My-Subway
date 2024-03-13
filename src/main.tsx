/* eslint-disable @typescript-eslint/no-unused-vars */
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

import { registerSW } from "virtual:pwa-register";

registerSW();

ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
