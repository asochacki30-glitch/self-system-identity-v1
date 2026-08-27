const canvas = document.getElementById("mainCanvas");
const ctx = canvas.getContext("2d");

let currentMouseX = canvas.width / 2;
let currentMouseY = canvas.height / 2;
let lastMouseX = currentMouseX;
let lastMouseY = currentMouseY;
let prevMouseX = currentMouseX;
let prevMouseY = currentMouseY;

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  currentMouseX = event.clientX - rect.left;
  currentMouseY = event.clientY - rect.top;
});

let smoothedSpeed = 0;

// Below this speed: draw a smooth curling curve
// Above this speed: shatter into geometric fragments instead
const slowThreshold = 3;
const fastThreshold = 14;

function drawVignette() {
  const gradient = ctx.createRadialGradient(
    canvas.width / 2, canvas.height / 2, 100,
    canvas.width / 2, canvas.height / 2, 420
  );
  gradient.addColorStop(0, "rgba(0,0,0,0)");
  gradient.addColorStop(1, "rgba(0,0,0,0.9)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function loop() {
  // A very faint fade each frame — old marks linger and slowly
  // soften, instead of the canvas fully clearing or drawing forever
  ctx.fillStyle = "rgba(10, 14, 26, 0.02)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const dx = currentMouseX - lastMouseX;
  const dy = currentMouseY - lastMouseY;
  const rawSpeed = Math.sqrt(dx * dx + dy * dy);
  smoothedSpeed += (rawSpeed - smoothedSpeed) * 0.2;

  if (rawSpeed > 0.3 && rawSpeed < fastThreshold) {
    // ---- Slow movement: a smooth curling curve, never straight ----
    const midX = (lastMouseX + currentMouseX) / 2;
    const midY = (lastMouseY + currentMouseY) / 2;

    ctx.strokeStyle = "rgba(170, 205, 255, 0.55)";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(lastMouseX, lastMouseY);
    // quadraticCurveTo bends the line through prevMouse as a control
    // point, so it always comes out curved, never a straight segment
    ctx.quadraticCurveTo(prevMouseX, prevMouseY, midX, midY);
    ctx.stroke();

    // Occasionally drop a small circle "node" along the path
    if (Math.random() < 0.12) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(150, 195, 255, 0.4)";
      ctx.lineWidth = 1.5;
      ctx.arc(currentMouseX, currentMouseY, 4 + Math.random() * 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (rawSpeed >= fastThreshold) {
    // ---- Fast movement: sharp geometric fragments ----
    ctx.strokeStyle = "rgba(255, 255, 255, 0.85)";
    ctx.lineWidth = 1.5;

    // A few short straight shards flying outward from the cursor
    const shardCount = 3;
    for (let i = 0; i < shardCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const len = 10 + Math.random() * 22;
      const ex = currentMouseX + Math.cos(angle) * len;
      const ey = currentMouseY + Math.sin(angle) * len;
      ctx.beginPath();
      ctx.moveTo(currentMouseX, currentMouseY);
      ctx.lineTo(ex, ey);
      ctx.stroke();
    }

    // A small angular triangle, like a fragment breaking off
    const size = 8 + Math.random() * 12;
    ctx.beginPath();
    ctx.moveTo(currentMouseX, currentMouseY - size);
    ctx.lineTo(currentMouseX + size, currentMouseY + size);
    ctx.lineTo(currentMouseX - size, currentMouseY + size);
    ctx.closePath();
    ctx.stroke();
  }

  drawVignette();

  prevMouseX = lastMouseX;
  prevMouseY = lastMouseY;
  lastMouseX = currentMouseX;
  lastMouseY = currentMouseY;

  requestAnimationFrame(loop);
}

loop();