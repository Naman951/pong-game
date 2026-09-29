const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const playerScoreEl = document.getElementById('playerScore');
const computerScoreEl = document.getElementById('computerScore');

const paddleWidth = 18;
const paddleHeight = 110;
const ballRadius = 10;
const paddleSpeed = 7;

const leftPaddle = {
  x: 20,
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: paddleSpeed,
};

const rightPaddle = {
  x: canvas.width - (paddleWidth + 20),
  y: canvas.height / 2 - paddleHeight / 2,
  width: paddleWidth,
  height: paddleHeight,
  speed: 5.5,
};

const ball = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: ballRadius,
  speed: 5.8,
  vx: 5,
  vy: 3,
};

const keys = {
  up: false,
  down: false,
};

let playerScore = 0;
let computerScore = 0;

function resetBall(direction) {
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  const angle = (Math.random() * 1.2) - 0.6;
  ball.speed = 5.8;
  ball.vx = direction * (5 + Math.random() * 1.2);
  ball.vy = angle * 5;
}

function updateScoreboard() {
  playerScoreEl.textContent = String(playerScore);
  computerScoreEl.textContent = String(computerScore);
}

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function handleInput() {
  if (keys.up) {
    leftPaddle.y -= leftPaddle.speed;
  }

  if (keys.down) {
    leftPaddle.y += leftPaddle.speed;
  }

  leftPaddle.y = clamp(leftPaddle.y, 0, canvas.height - leftPaddle.height);
}

function updateComputer() {
  const targetY = ball.y - rightPaddle.height / 2;
  const diff = targetY - rightPaddle.y;
  rightPaddle.y += diff * 0.12;
  rightPaddle.y = clamp(rightPaddle.y, 0, canvas.height - rightPaddle.height);
}

function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;

  if (ball.y - ball.radius <= 0 || ball.y + ball.radius >= canvas.height) {
    ball.vy *= -1;
    ball.y = clamp(ball.y, ball.radius, canvas.height - ball.radius);
  }

  if (
    ball.x - ball.radius <= leftPaddle.x + leftPaddle.width &&
    ball.x + ball.radius >= leftPaddle.x &&
    ball.y >= leftPaddle.y &&
    ball.y <= leftPaddle.y + leftPaddle.height &&
    ball.vx < 0
  ) {
    const offset = (ball.y - (leftPaddle.y + leftPaddle.height / 2)) / (leftPaddle.height / 2);
    ball.x = leftPaddle.x + leftPaddle.width + ball.radius;
    ball.vx = Math.abs(ball.vx) + 0.15;
    ball.vy = offset * 5.5;
  }

  if (
    ball.x + ball.radius >= rightPaddle.x &&
    ball.x - ball.radius <= rightPaddle.x + rightPaddle.width &&
    ball.y >= rightPaddle.y &&
    ball.y <= rightPaddle.y + rightPaddle.height &&
    ball.vx > 0
  ) {
    const offset = (ball.y - (rightPaddle.y + rightPaddle.height / 2)) / (rightPaddle.height / 2);
    ball.x = rightPaddle.x - ball.radius;
    ball.vx = -Math.abs(ball.vx) - 0.15;
    ball.vy = offset * 5.5;
  }

  if (ball.x - ball.radius <= 0) {
    computerScore += 1;
    updateScoreboard();
    resetBall(1);
  }

  if (ball.x + ball.radius >= canvas.width) {
    playerScore += 1;
    updateScoreboard();
    resetBall(-1);
  }
}

function drawBackground() {
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(148, 163, 184, 0.7)';
  ctx.lineWidth = 3;
  ctx.setLineDash([12, 12]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPaddle(x, y, width, height) {
  ctx.fillStyle = '#7dd3fc';
  ctx.fillRect(x, y, width, height);
}

function drawBall() {
  ctx.fillStyle = '#f8fafc';
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fill();
}

function draw() {
  drawBackground();
  drawPaddle(leftPaddle.x, leftPaddle.y, leftPaddle.width, leftPaddle.height);
  drawPaddle(rightPaddle.x, rightPaddle.y, rightPaddle.width, rightPaddle.height);
  drawBall();
}

function gameLoop() {
  handleInput();
  updateComputer();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

window.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowUp') {
    keys.up = true;
  }

  if (event.key === 'ArrowDown') {
    keys.down = true;
  }
});

window.addEventListener('keyup', (event) => {
  if (event.key === 'ArrowUp') {
    keys.up = false;
  }

  if (event.key === 'ArrowDown') {
    keys.down = false;
  }
});

canvas.addEventListener('mousemove', (event) => {
  const rect = canvas.getBoundingClientRect();
  const mouseY = event.clientY - rect.top;
  leftPaddle.y = mouseY - leftPaddle.height / 2;
  leftPaddle.y = clamp(leftPaddle.y, 0, canvas.height - leftPaddle.height);
});

updateScoreboard();
resetBall(Math.random() > 0.5 ? 1 : -1);
requestAnimationFrame(gameLoop);
