const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

canvas.width = 400;
canvas.height = window.innerHeight;

let keys = {};
let bullets = [];
let enemies = [];
let score = 0;
let health = 100;
let gameRunning = true;

let mouse = { x: 0, y: 0 };

// Player
let player = {
  x: 200,
  y: canvas.height - 100,
  size: 20,
  speed: 5
};

// Controls
document.addEventListener("keydown", e => {
  keys[e.key] = true;
  if (e.key === "r" || e.key === "R") location.reload();
});

document.addEventListener("keyup", e => {
  keys[e.key] = false;
});

// Mouse aim
canvas.addEventListener("mousemove", e => {
  mouse.x = e.clientX - canvas.offsetLeft;
  mouse.y = e.clientY;
});

// Shoot bullets
canvas.addEventListener("click", () => {
  let angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);

  bullets.push({
    x: player.x,
    y: player.y,
    dx: Math.cos(angle) * 6,
    dy: Math.sin(angle) * 6,
    size: 5
  });
});

// Spawn enemies
function spawnEnemy() {
  enemies.push({
    x: Math.random() * canvas.width,
    y: 0,
    size: 20,
    speed: 1.5
  });
}
setInterval(spawnEnemy, 1500);

// Draw player
function drawPlayer() {
  ctx.fillStyle = "cyan";
  ctx.beginPath();
  ctx.arc(player.x, player.y, player.size, 0, Math.PI * 2);
  ctx.fill();
}

// Move player
function movePlayer() {
  if (keys["ArrowLeft"] && player.x > 0) player.x -= player.speed;
  if (keys["ArrowRight"] && player.x < canvas.width) player.x += player.speed;
  if (keys["ArrowUp"] && player.y > 0) player.y -= player.speed;
  if (keys["ArrowDown"] && player.y < canvas.height) player.y += player.speed;
}

// Draw bullets
function drawBullets() {
  ctx.fillStyle = "yellow";

  bullets.forEach((b, i) => {
    b.x += b.dx;
    b.y += b.dy;

    ctx.beginPath();
    ctx.arc(b.x, b.y, b.size, 0, Math.PI * 2);
    ctx.fill();

    if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
      bullets.splice(i, 1);
    }
  });
}

// Enemy AI (chasing player)
function drawEnemies() {
  ctx.fillStyle = "red";

  enemies.forEach((e, ei) => {
    let angle = Math.atan2(player.y - e.y, player.x - e.x);
    e.x += Math.cos(angle) * e.speed;
    e.y += Math.sin(angle) * e.speed;

    ctx.beginPath();
    ctx.arc(e.x, e.y, e.size, 0, Math.PI * 2);
    ctx.fill();

    // Collision with player
    let dist = Math.hypot(player.x - e.x, player.y - e.y);
    if (dist < player.size + e.size) {
      health -= 1;
      if (health <= 0) endGame();
    }

    // Bullet hit
    bullets.forEach((b, bi) => {
      let d = Math.hypot(b.x - e.x, b.y - e.y);
      if (d < e.size) {
        enemies.splice(ei, 1);
        bullets.splice(bi, 1);
        score++;
      }
    });
  });
}

// Game over
function endGame() {
  gameRunning = false;
  document.getElementById("gameOver").style.display = "block";
}

// Game loop
function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  movePlayer();
  drawPlayer();
  drawBullets();
  drawEnemies();

  document.getElementById("info").innerText =
    "Health: " + health + " | Score: " + score;

  requestAnimationFrame(gameLoop);
}

gameLoop();