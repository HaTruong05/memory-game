import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Board from "./board.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Board></Board>
  </StrictMode>
);
