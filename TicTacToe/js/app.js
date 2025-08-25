import { getUserSelectedPlayer } from "./domHelpers.js";

// --- Elements ---
const playBox = document.getElementById("play-box");
const startBtnBox = document.getElementById("startBtn-box");
const selectionBtns = document.getElementsByClassName("selectBtn");
const gridBtns = document.querySelectorAll(".grid-btn");
const robot = document.getElementById("robot");
const user = document.getElementById("user");
const startBtn = document.getElementById("start-btn");

// Result elements
const restart = document.getElementById("restart");
const resultBox = document.getElementById("result-box");
const resultTitle = document.getElementById("result-title");
const winnerBox = document.getElementById("winner-box");
const homeButton = document.getElementById("home");

// Winning lines
const crossLeftLine = document.getElementById("cross-left");
const crossRightLine = document.getElementById("cross-right");
const verticalLine = document.getElementById("vertical");
const horizontalLine = document.getElementById("horizontal");

let starterPlayer = "robot";
const winPattern = [
    [0, 1, 2], [0, 4, 8], [0, 3, 6],
    [1, 4, 7], [2, 4, 6], [2, 5, 8],
    [3, 4, 5], [6, 7, 8]
];
const gameState = Array(9).fill(" ");

// --- Helpers ---
const toggleGrid = (disabled) => gridBtns.forEach(btn => btn.disabled = disabled);

const resetGame = () => {
    gameState.fill(" ");
    gridBtns.forEach(btn => {
        btn.querySelector("img").src = "";
        btn.dataset.played = "false";
    });
    [verticalLine, horizontalLine, crossLeftLine, crossRightLine]
        .forEach(line => line.style.display = "none");
};

const delay = (fn, ms = 1000) => setTimeout(fn, ms);

const activePlayer = (active, other) => {
    other.classList.remove("active-user");
    other.classList.add("deactive-user");
    active.classList.add("active-user");
    active.classList.remove("deactive-user");
};

// --- Game Flow ---
Object.values(selectionBtns).forEach((btn, idx) => {
    btn.addEventListener("click", () => {
        starterPlayer = getUserSelectedPlayer(Object.values(selectionBtns), idx);
    });
});

startBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playBox.style.display = "block";
    startBtnBox.style.display = "none";
    setFirstRoundPlayer(starterPlayer);
});

restart.addEventListener("click", () => {
    playBox.style.display = "block";
    startBtnBox.style.display = "none";
    resultBox.style.display = "none";
    resetGame();
    setFirstRoundPlayer(starterPlayer);
});

homeButton.addEventListener("click", () => {
    startBtnBox.style.display = "flex";
    playBox.style.display = "none";
    resultBox.style.display = "none";
    resetGame();
});

gridBtns.forEach((btn, idx) => btn.addEventListener("click", () => userPlay(btn, idx)));

// --- Functions ---
function setFirstRoundPlayer(player) {
    if (player === "user") {
        activePlayer(user, robot);
        toggleGrid(false);
    } else if (player === "robot") {
        activePlayer(robot, user);
        toggleGrid(true);
        delay(() => AIMove(true));
    } else {
        Math.random() < 0.5 ? setFirstRoundPlayer("robot") : setFirstRoundPlayer("user");
    }
}

function userPlay(btn, index) {
    btn.querySelector("img").src = "assets/cross.svg";
    gameState[index] = "X";
    btn.dataset.played = "true";
    toggleGrid(true);
    activePlayer(robot, user);

    const winIndex = checkForWinner("X");
    winIndex !== undefined ? endGame(winIndex, "X") : delay(AIMove, 2000);
}

function AIMove(firstMove = false) {
    const addMove = (i) => {
        gridBtns[i].querySelector("img").src = "assets/circle.svg";
        gameState[i] = "O";
        gridBtns[i].dataset.played = "true";
    };

    const findCellGroup = (need, player) => winPattern.find(p => {
        const cells = p.map(i => gameState[i]);
        const filled = cells.filter(c => c === player).length;
        const empty = cells.filter(c => c === " ").length;
        return filled === need && empty > 0;
    });

    if (firstMove) {
        const corners = [0, 2, 6, 8].filter(i => gameState[i] === " ");
        addMove(corners[Math.floor(Math.random() * corners.length)]);
    } else {
        const win = findCellGroup(2, "O") || findCellGroup(2, "X") || findCellGroup(1, "O") || findCellGroup(1, "X");
        if (win) addMove(win.find(i => gameState[i] === " "));
    }

    const winIndex = checkForWinner("O");
    if (winIndex !== undefined) return endGame(winIndex, "O");

    if (gameState.every(c => c !== " ")) return delay(() => showResults("draw"), 2000);

    toggleGrid(false);
    activePlayer(user, robot);
}

function checkForWinner(player) {
    const combo = winPattern.find(([a, b, c]) =>
        gameState[a] === player && gameState[b] === player && gameState[c] === player
    );
    return combo ? winPattern.indexOf(combo) : undefined;
}

function drawLine(index) {
    const cellW = gridBtns[0].clientWidth;
    const cellH = gridBtns[0].clientHeight;

    if ([2, 3, 5].includes(index)) {
        verticalLine.style.left = (cellW * [2, 3, 5].indexOf(index) + cellW / 2) + "px";
        verticalLine.style.display = "block";
    } else if ([0, 6, 7].includes(index)) {
        horizontalLine.style.top = (cellH * [0, 6, 7].indexOf(index) + cellH / 2) + "px";
        horizontalLine.style.display = "block";
    } else if (index === 1) crossLeftLine.style.display = "block";
    else if (index === 4) crossRightLine.style.display = "block";
}

function endGame(winIndex, player) {
    drawLine(winIndex);
    delay(() => showResults(player), 3000);
}

function showResults(winner) {
    const addImage = (src, alt = "") => {
        const img = document.createElement("img");
        img.src = src;
        img.alt = alt;
        winnerBox.appendChild(img);
    };

    playBox.style.display = "none";
    resultBox.style.display = "flex";
    winnerBox.innerHTML = "";

    if (winner === "O") {
        resultTitle.textContent = "Oops! The Robot Won";
        addImage("assets/robot.png");
    } else if (winner === "X") {
        resultTitle.textContent = "Congratulations, You Won!";
        addImage("assets/user.png");
    } else {
        resultTitle.textContent = "No Winner This Time";
        addImage("assets/robot.png");
        addImage("assets/user.png");
    }
}
