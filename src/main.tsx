import React from "react";
// Smart cursor visibility: hide on touch, show on mouse
function setupSmartCursor() {
  let lastPointerType = '';
  const body = document.body;
  window.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'touch') {
      body.classList.add('hide-cursor');
      lastPointerType = 'touch';
    } else if (e.pointerType === 'mouse') {
      body.classList.remove('hide-cursor');
      lastPointerType = 'mouse';
    }
  });
  // Also show cursor on mouse move
  window.addEventListener('mousemove', () => {
    if (lastPointerType !== 'mouse') {
      body.classList.remove('hide-cursor');
      lastPointerType = 'mouse';
    }
  });
}

setupSmartCursor();
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
);
