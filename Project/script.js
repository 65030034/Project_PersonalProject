const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartBtn = document.getElementById("restartBtn");

// ตั้งค่าขนาดของ canvas
canvas.width = 400;
canvas.height = 400;

// กำหนดขนาดของ Snake
const box = 20;

// สร้างตัวแปร Snake
let snake;
let direction;
let food;
let gameInterval;
let score;

// ฟังก์ชันเริ่มเกมใหม่
function startGame() {
    snake = [{ x: 10 * box, y: 10 * box }];
    direction = "RIGHT";
    score = 0; // รีเซ็ตคะแนน

    food = {
        x: Math.floor(Math.random() * (canvas.width / box)) * box,
        y: Math.floor(Math.random() * (canvas.height / box)) * box
    };

    restartBtn.style.display = "none"; // ซ่อนปุ่มเริ่มใหม่

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, 100);
}

// ฟังก์ชันควบคุมทิศทาง รองรับทั้งภาษาอังกฤษและภาษาไทย
document.addEventListener("keydown", (event) => {
    // ควบคุมขึ้น: กด w หรือ ไ
    if ((event.key === "w" || event.key === "ไ") && direction !== "DOWN") {
        direction = "UP";
    } 
    // ควบคุมลง: กด s หรือ ห
    else if ((event.key === "s" || event.key === "ห") && direction !== "UP") {
        direction = "DOWN";
    } 
    // ควบคุมซ้าย: กด a หรือ ฟ
    else if ((event.key === "a" || event.key === "ฟ") && direction !== "RIGHT") {
        direction = "LEFT";
    } 
    // ควบคุมขวา: กด d หรือ ก
    else if ((event.key === "d" || event.key === "ก") && direction !== "LEFT") {
        direction = "RIGHT";
    }
});

// ฟังก์ชันตรวจสอบการชนขอบหรือชนตัวเอง
function collision(head, array) {
    return array.some(segment => head.x === segment.x && head.y === segment.y);
}

// ฟังก์ชันอัปเดตเกม
function updateGame() {
    let head = { ...snake[0] };

    // เปลี่ยนทิศทาง
    if (direction === "UP") head.y -= box;
    if (direction === "DOWN") head.y += box;
    if (direction === "LEFT") head.x -= box;
    if (direction === "RIGHT") head.x += box;

    // ตรวจสอบว่ากินอาหารไหม
    if (head.x === food.x && head.y === food.y) {
        score++; // เพิ่มคะแนน
        food = {
            x: Math.floor(Math.random() * (canvas.width / box)) * box,
            y: Math.floor(Math.random() * (canvas.height / box)) * box
        };
    } else {
        snake.pop();
    }

    // ตรวจสอบการชน
    if (
        head.x < 0 || head.x >= canvas.width || 
        head.y < 0 || head.y >= canvas.height || 
        collision(head, snake)
    ) {
        clearInterval(gameInterval); // หยุดเกม
        drawGameOver();
        restartBtn.style.display = "block"; // แสดงปุ่มเริ่มใหม่
        return;
    }

    // เพิ่มหัว Snake
    snake.unshift(head);
}

// ฟังก์ชันวาดเกม
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // วาดอาหาร
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);

    // วาด Snake
    snake.forEach((segment, index) => {
        ctx.fillStyle = index === 0 ? "lime" : "green";
        ctx.fillRect(segment.x, segment.y, box, box);
        ctx.strokeStyle = "black";
        ctx.strokeRect(segment.x, segment.y, box, box);
    });

    // แสดงคะแนน
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("คะแนน: " + score, 10, 20);
}

// ฟังก์ชันแสดงข้อความ "Game Over"
function drawGameOver() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText("Game Over", canvas.width / 4, canvas.height / 2);
}

// ฟังก์ชันเล่นเกม
function gameLoop() {
    updateGame();
    drawGame();
}

// เริ่มเกมครั้งแรก
startGame();

// กดปุ่มเพื่อเริ่มใหม่
restartBtn.addEventListener("click", startGame);
