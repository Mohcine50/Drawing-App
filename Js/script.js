const size = document.getElementById("size");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const eraser = document.getElementById("eraser");
const brush = document.getElementById("brush");
const shapes = document.querySelectorAll(".option");

const clear = document.getElementById("clear");
const save = document.getElementById("save");
const fillColor = document.getElementById("fill");
let isDrawing = false;
let strokeSize = size.value;
let brushType = "Brush";
let isFillChecked = fillColor.checked;

const canvaBackground = () => {
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = color;
};

fillColor.addEventListener("change", (e) => {
  isFillChecked = fillColor.checked;
});

ctx.strokeStyle = "#fff";
window.addEventListener("load", () => {
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;
});

const colorPicker = new iro.ColorPicker("#picker", {
  width: 130,
  layout: [
    {
      component: iro.ui.Wheel,
      options: {},
    },
  ],
});
let color = "#fff";
size.addEventListener("change", (e) => {
  strokeSize = e.target.value;
});

colorPicker.on("color:change", (pickedColor) => {
  color = pickedColor.hexString;
});

let prevX, prevY, snapShot;

const startDraw = (e) => {
  isDrawing = true;
  ctx.beginPath();
  ctx.lineWidth = strokeSize;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  prevX = e.offsetX;
  prevY = e.offsetY;
  snapShot = ctx.getImageData(0, 0, canvas.width, canvas.height);
};

const draw = (e) => {
  if (!isDrawing) return;
  const X = e.offsetX;
  const Y = e.offsetY;
  ctx.putImageData(snapShot, 0, 0);
  switch (brushType) {
    case "Brush":
      ctx.lineTo(X, Y);
      ctx.stroke();
      break;
    case "Eraser":
      ctx.lineTo(X, Y);
      ctx.strokeStyle = "#000";
      ctx.stroke();
      break;
    case "Rectangle":
      if (!isFillChecked) {
        return ctx.strokeRect(X, Y, prevX - X, prevY - Y);
      }
      ctx.fillRect(X, Y, prevX - X, prevY - Y);
      break;
    case "Circle":
      let radius = Math.sqrt(Math.pow(prevX - X, 2) + Math.pow(prevY - Y, 2));
      ctx.beginPath();
      ctx.arc(prevX, prevY, radius, 0, Math.PI * 2);
      isFillChecked ? ctx.fill() : ctx.stroke();
      break;
    case "Line":
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(X, Y);
      ctx.stroke();
      break;
    case "Triangle":
      ctx.beginPath();
      ctx.moveTo(prevX, prevY);
      ctx.lineTo(X, Y);
      ctx.lineTo(prevX * 2 - X, Y);
      ctx.closePath();
      isFillChecked ? ctx.fill() : ctx.stroke();
      break;
  }
};
canvas.addEventListener("mousedown", (e) => {
  startDraw(e);
});
canvas.addEventListener("mousemove", draw);
canvas.addEventListener("mouseup", () => {
  isDrawing = false;
});

shapes.forEach((shape) => {
  shape.addEventListener("click", (e) => {
    document.querySelector(".active").classList.remove("active");
    e.target.classList.add("active");
    brushType = e.target.innerText;
  });
});

clear.addEventListener("click", () => {
  canvaBackground();
});

save.addEventListener("click", () => {
  const link = document.createElement("a");
  link.download = `${Date.now()}.jpg`;
  link.href = canvas.toDataURL("image/pnj", 1.0);
  link.click();
});

brush.addEventListener("click", (e) => {
  document.querySelector(".active").classList.remove("active");
  e.target.classList.add("active");
  brushType = e.target.innerText;
});

eraser.addEventListener("click", (e) => {
  document.querySelector(".active").classList.remove("active");
  e.target.classList.add("active");
  brushType = e.target.innerText;
});
