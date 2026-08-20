// ---------- Test 1: Sigil Seed ----------

const canvas1 = document.getElementById("test1");
const ctx1 = canvas1.getContext("2d");

function drawSigil(ctx, x, y, size) {
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;

  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.stroke();
}

drawSigil(ctx1, canvas1.width / 2, canvas1.height / 2, 60);


// ---------- Test 2: Behavior Rule (reacts to cursor speed) ----------

const canvas2 = document.getElementById("test2");
const ctx2 = canvas2.getContext("2d");

let lastMouseX = canvas2.width / 2;
let lastMouseY = canvas2.height / 2;
let currentMouseX = lastMouseX;
let currentMouseY = lastMouseY;

canvas2.addEventListener("mousemove", (event) => {
  const rect = canvas2.getBoundingClientRect();
  currentMouseX = event.clientX - rect.left;
  currentMouseY = event.clientY - rect.top;
});

let smoothedSpeed = 0;

function drawSpeedReaction() {
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);

  const dx = currentMouseX - lastMouseX;
  const dy = currentMouseY - lastMouseY;
  const rawSpeed = Math.sqrt(dx * dx + dy * dy);

  smoothedSpeed += (rawSpeed - smoothedSpeed) * 0.15;
  const cappedSpeed = Math.min(smoothedSpeed, 40);

  const baseSize = 40;
  const size = baseSize + cappedSpeed * 1.5;

  const spikes = 10;
  ctx2.strokeStyle = "#ffffff";
  ctx2.lineWidth = 2;
  ctx2.beginPath();

  for (let i = 0; i <= spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2;
    const jitter = (Math.random() - 0.5) * cappedSpeed;
    const r = size + jitter;

    const x = canvas2.width / 2 + Math.cos(angle) * r;
    const y = canvas2.height / 2 + Math.sin(angle) * r;

    if (i === 0) ctx2.moveTo(x, y);
    else ctx2.lineTo(x, y);
  }

  ctx2.closePath();
  ctx2.stroke();

  lastMouseX = currentMouseX;
  lastMouseY = currentMouseY;

  requestAnimationFrame(drawSpeedReaction);
}

drawSpeedReaction();


// ---------- Test 3: Gesture Language (slow reveals, fast hides) ----------

const canvas3 = document.getElementById("test3");
const ctx3 = canvas3.getContext("2d");

const sceneCanvas = document.createElement("canvas");
sceneCanvas.width = canvas3.width;
sceneCanvas.height = canvas3.height;
const sceneCtx = sceneCanvas.getContext("2d");

function drawLofiScene(ctx) {
  const w = canvas3.width;
  const h = canvas3.height;

  ctx.fillStyle = "#1b1f2e";
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = "#f4e9c1";
  ctx.beginPath();
  ctx.arc(w * 0.75, h * 0.25, 30, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "#ffffff";
  const starPositions = [
    [40, 30], [90, 60], [150, 20], [200, 80], [260, 40], [320, 70]
  ];
  for (const [sx, sy] of starPositions) {
    ctx.fillRect(sx, sy, 2, 2);
  }

  ctx.strokeStyle = "#3a3f55";
  ctx.lineWidth = 6;
  ctx.strokeRect(w * 0.15, h * 0.15, w * 0.35, h * 0.5);
  ctx.beginPath();
  ctx.moveTo(w * 0.15 + (w * 0.35) / 2, h * 0.15);
  ctx.lineTo(w * 0.15 + (w * 0.35) / 2, h * 0.65);
  ctx.stroke();

  ctx.strokeStyle = "#e8b23d";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(w * 0.1, h * 0.9);
  ctx.lineTo(w * 0.1, h * 0.75);
  ctx.lineTo(w * 0.18, h * 0.68);
  ctx.stroke();
  ctx.fillStyle = "#e8b23d";
  ctx.beginPath();
  ctx.arc(w * 0.18, h * 0.68, 6, 0, Math.PI * 2);
  ctx.fill();
}

drawLofiScene(sceneCtx);

let lastMouseX3 = canvas3.width / 2;
let lastMouseY3 = canvas3.height / 2;
let currentMouseX3 = lastMouseX3;
let currentMouseY3 = lastMouseY3;

canvas3.addEventListener("mousemove", (event) => {
  const rect = canvas3.getBoundingClientRect();
  currentMouseX3 = event.clientX - rect.left;
  currentMouseY3 = event.clientY - rect.top;
});

let revealAmount = 0;
const slowThreshold = 4;
const fastThreshold = 15;

function drawGestureReveal() {
  ctx3.clearRect(0, 0, canvas3.width, canvas3.height);

  const dx = currentMouseX3 - lastMouseX3;
  const dy = currentMouseY3 - lastMouseY3;
  const speed = Math.sqrt(dx * dx + dy * dy);

  if (speed < slowThreshold) {
    revealAmount += 0.01;
  } else if (speed > fastThreshold) {
    revealAmount -= 0.08;
  }

  revealAmount = Math.max(0, Math.min(1, revealAmount));

  ctx3.globalAlpha = revealAmount;
  ctx3.drawImage(sceneCanvas, 0, 0);
  ctx3.globalAlpha = 1;

  lastMouseX3 = currentMouseX3;
  lastMouseY3 = currentMouseY3;

  requestAnimationFrame(drawGestureReveal);
}

drawGestureReveal();
const canvas4 = document.getElementById("test4");
const ctx4 = canvas4.getContext("2d");

// Draw something simple in the middle first
ctx4.fillStyle = "#ffffff";
ctx4.beginPath();
ctx4.arc(canvas4.width / 2, canvas4.height / 2, 40, 0, Math.PI * 2);
ctx4.fill();

// Then lay a radial gradient on top that's transparent in the
// middle and fades to black at the edges — this is the "vignette"
const gradient = ctx4.createRadialGradient(
  canvas4.width / 2, canvas4.height / 2, 60,
  canvas4.width / 2, canvas4.height / 2, 260
);
gradient.addColorStop(0, "rgba(0,0,0,0)");
gradient.addColorStop(1, "rgba(0,0,0,1)");

ctx4.fillStyle = gradient;
ctx4.fillRect(0, 0, canvas4.width, canvas4.height);