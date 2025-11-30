import exampleIconUrl from "./noun-paperclip-7598668-00449F.png";
import "./style.css";

document.body.innerHTML = "";

// --- Title ---
const title = document.createElement("h1");
title.textContent = "Sticker Sketchpad";
document.body.appendChild(title);

// --- Canvas ---
const canvas = document.createElement("canvas");
canvas.width = 256;
canvas.height = 256;
canvas.id = "sketchCanvas";
document.body.appendChild(canvas);

const ctx = canvas.getContext("2d")!;

// --- Clear Button ---
const clearBtn = document.createElement("button");
clearBtn.textContent = "Clear";
document.body.appendChild(clearBtn);

// =============================
// STEP 3 DATA STRUCTURES
// =============================

// displayList is an array of strokes
// each stroke is an array of points: [x, y]
let displayList: Array<Array<[number, number]>> = [];

// current stroke user is drawing (null if not drawing)
let currentStroke: Array<[number, number]> | null = null;

// =============================
// STEP 3 REDRAW FUNCTION
// =============================
function redraw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (const stroke of displayList) {
    if (stroke.length < 2) continue;

    ctx.beginPath();
    ctx.moveTo(stroke[0][0], stroke[0][1]);

    for (let i = 1; i < stroke.length; i++) {
      ctx.lineTo(stroke[i][0], stroke[i][1]);
    }

    ctx.stroke();
  }
}

// Listen for the custom event
canvas.addEventListener("drawing-changed", () => {
  redraw();
});

// =============================
// STEP 3 MOUSE EVENTS
// =============================
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  currentStroke = [[x, y]];
  displayList.push(currentStroke);

  // stroke changed
  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mousemove", (e) => {
  if (!currentStroke) return;

  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  currentStroke.push([x, y]);

  canvas.dispatchEvent(new Event("drawing-changed"));
});

canvas.addEventListener("mouseup", () => {
  currentStroke = null;
});

canvas.addEventListener("mouseleave", () => {
  currentStroke = null;
});

// =============================
// CLEAR BUTTON
// =============================
clearBtn.addEventListener("click", () => {
  displayList = [];
  canvas.dispatchEvent(new Event("drawing-changed"));
});

// Example asset block
const example = document.createElement("p");
example.innerHTML =
  `Example asset: <img src="${exampleIconUrl}" class="icon" />`;
document.body.appendChild(example);
