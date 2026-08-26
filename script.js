const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

let lastMouseX = canvas.width / 2;
let lastMouseY = canvas.height / 2;
let currentMouseX = lastMouseX;
let currentMouseY = lastMouseY;

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  currentMouseX = event.clientX - rect.left;
  currentMouseY = event.clientY - rect.top;
});

let smoothedSpeed = 0;
let revealAmount = 0;

const slowThreshold = 4;
const fastThreshold = 15;

function drawSigil(x, y, size, jitterAmount) {
  ctx.beginPath();
  const spikes = 10;
  for (let i = 0; i <= spikes; i++) {
    const angle = (i / spikes) * Math.PI * 2;
    const jitter = (Math.random() - 0.5) * jitterAmount;
    const r = size + jitter;
    const px = x + Math.cos(angle) * r;
    const py = y + Math.sin(angle) * r;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - size, y);
  ctx.lineTo(x + size, y);
  ctx.stroke();
}

function drawVignette() {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 80,
    canvas.width / 2, canvas.height / 2, 320
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const dx = currentMouseX - lastMouseX;
  const dy = currentMouseY - lastMouseY;
  const rawSpeed = Math.sqrt(dx * dx + dy * dy);
  smoothedSpeed += (rawSpeed - smoothedSpeed) * 0.15;
  const cappedSpeed = Math.min(smoothedSpeed, 40);

  const baseSize = 50;
  const size = baseSize + cappedSpeed * 1.2;
  const jitter = cappedSpeed;

  if (rawSpeed < slowThreshold) {
    revealAmount += 0.01;
  } else if (rawSpeed > fastThreshold) {
    revealAmount -= 0.08;
  }
  revealAmount = Math.max(0, Math.min(1, revealAmount));

  ctx.globalAlpha = revealAmount;
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 2;
  drawSigil(canvas.width / 2, canvas.height / 2, size, jitter);
  ctx.globalAlpha = 1;

  drawVignette();

  lastMouseX = currentMouseX;
  lastMouseY = currentMouseY;

  requestAnimationFrame(loop);
}

loop();