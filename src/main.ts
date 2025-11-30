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

// --- Buttons ---
const buttonRow = document.createElement("div");
document.body.appendChild(buttonRow);

const clearBtn = document.createElement("button");
clearBtn.textContent = "Clear";
buttonRow.appendChild(clearBtn);

const undoBtn = document.createElement("button");
undoBtn.textContent = "Undo";
buttonRow.appendChild(undoBtn);

const redoBtn = document.createElement("button");
redoBtn.textContent = "Redo";
buttonRow.appendChild(redoBtn);

// =============================
// DATA STRUCTURES
// =============================
let displayList: Array<Array<[number, number]>> = [];
let redoStack: Array<Array<[number, number]>> = [];

let currentStroke: Array<[number, number]> | null = null;

// =============================
// REDRAW
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

canvas.addEventListener("drawing-changed", () => {
  redraw();
});

// =============================
// MOUSE EVENTS
// =============================
canvas.addEventListener("mousedown", (e) => {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  currentStroke = [[x, y]];
  displayList.push(currentStroke);
  redoStack = []; // new drawing clears redo history

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
// CLEAR
// =============================
clearBtn.addEventListener("click", () => {
  displayList = [];
  redoStack = [];
  canvas.dispatchEvent(new Event("drawing-changed"));
});

// =============================
// UNDO / REDO
// =============================
undoBtn.addEventListener("click", () => {
  if (displayList.length === 0) return;

  const popped = displayList.pop()!;
  redoStack.push(popped);

  canvas.dispatchEvent(new Event("drawing-changed"));
});

redoBtn.addEventListener("click", () => {
  if (redoStack.length === 0) return;

  const popped = redoStack.pop()!;
  displayList.push(popped);

  canvas.dispatchEvent(new Event("drawing-changed"));
});

// Example image
const example = document.createElement("p");
example.innerHTML =
  `Example asset: <img src="${exampleIconUrl}" class="icon" />`;
document.body.appendChild(example);
