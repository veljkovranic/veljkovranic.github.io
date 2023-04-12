// const GRID_SIZE = 20;
const CELL_SIZE = 30;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const playPauseButton = document.getElementById("playPauseButton");


function updateCanvasSize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    console.log(canvas)
}

updateCanvasSize();
window.addEventListener("resize", updateCanvasSize);

let grid = Array.from({ length: Math.floor(window.innerWidth / CELL_SIZE) }, () =>
    Array.from({ length: Math.floor(window.innerHeight / CELL_SIZE) }, () => 0)
);

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function drawRandomCells(count) {
    for (let i = 0; i < count; i++) {
        const x = getRandomInt(0,  Math.floor(window.innerWidth / CELL_SIZE) - 1);
        const y = getRandomInt(0, Math.floor(window.innerHeight / CELL_SIZE) - 1);
        console.log(x, y)
        grid[x][y] = 1;
    }
}

drawRandomCells(200);

let playing = false;

playing = true;
interval = setInterval(gameLoop, 700);
// playPauseButton.addEventListener("click", () => {
//     playing = !playing;
//     playPauseButton.textContent = playing ? "Pause" : "Play";
//     if (playing) {
        
    
// });



canvas.addEventListener("mousedown", (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const gridX = Math.floor(x / CELL_SIZE);
    const gridY = Math.floor(y / CELL_SIZE);
    grid[gridX][gridY] = 1 - grid[gridX][gridY];
});

function drawGrid() {
    ctx.strokeStyle = "lightgray";
    for (let x = 0; x < canvas.width; x += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += CELL_SIZE) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }
}

function drawCells() {
    ctx.fillStyle = "gray";
    for (let x = 0; x < Math.floor(window.innerWidth / CELL_SIZE); x++) {
        for (let y = 0; y < Math.floor(window.innerHeight / CELL_SIZE); y++) {
            if (grid[x][y] === 1) {
                ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

function countNeighbors(x, y) {
    let count = 0;
    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if (i === 0 && j === 0) {
                continue;
            }
            const xi = (x + i + Math.floor(window.innerWidth / CELL_SIZE)) % Math.floor(window.innerWidth / CELL_SIZE);
            const yj = (y + j + Math.floor(window.innerHeight / CELL_SIZE)) % Math.floor(window.innerHeight / CELL_SIZE);
            count += grid[xi][yj];
        }
    }
    return count;
}

function updateCells() {
    const newGrid = Array.from({ length: Math.floor(window.innerWidth / CELL_SIZE) }, () =>
        Array.from({ length: Math.floor(window.innerHeight / CELL_SIZE) }, () => 0)
    );

    for (let x = 0; x < Math.floor(window.innerWidth / CELL_SIZE); x++) {
        for (let y = 0; y < Math.floor(window.innerHeight / CELL_SIZE); y++) {
            const neighbors = countNeighbors(x, y);
            if (grid[x][y] === 1) {
                if (neighbors === 2 || neighbors === 3) {
                    newGrid[x][y] = 1;
                }
            } else {
                if (neighbors === 3) {
                    newGrid[x][y] = 1;
                }
            }
        }
    }

    return newGrid;
}

function gameLoop() {
    if (playing) {
        grid = updateCells();
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawGrid();
    drawCells();
    dataUrl = canvas.toDataURL();
    document.body.style.background = 'url('+dataUrl+')'
    // setInterval(gameLoop, 1000);
    // requestAnimationFrame(gameLoop);
}

gameLoop();
