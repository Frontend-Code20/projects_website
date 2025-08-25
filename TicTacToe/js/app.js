import { getUserSelectedPlayer } from "./domHelpers.js";

const gridBtns = document.querySelectorAll('.grid-btn');
const robot = document.getElementById('robot');
const user = document.getElementById('user');
const startBtn = document.getElementById('start-btn');
const gameGrid = document.getElementById('game-grid');
const playBox = document.getElementById('play-box')
const startBtnBox = document.getElementById('startBtn-box');
const winnerBox = document.getElementById('winner-box');

// Result Section Elements
const restart = document.getElementById('restart');
const resultBox = document.getElementById('result-box');
const resultTitle = document.getElementById('result-title');
const homeButton = document.getElementById("home");

// Wining lines
const crossLeftLine = document.getElementById('cross-left');
const crossRightLine = document.getElementById('cross-right');
const verticalLine = document.getElementById('vertical');
const horizontalLine = document.getElementById('horizontal');

const selectionBtns = document.getElementsByClassName("selectBtn");
let starterPlayer = "robot";

Object.values(selectionBtns).forEach((btn, idx) => {
    btn.addEventListener("click", () => {
        starterPlayer = getUserSelectedPlayer(Object.values(selectionBtns), idx);
        console.log(starterPlayer);
    })
});

let playTime = 'robot';
const winPatturn = [[0, 1, 2], [0, 4, 8], [0, 3, 6], [1, 4, 7], [2, 4, 6], [2, 5, 8], [3, 4, 5], [6, 7, 8]];
const winingLines = [
    ['x', 'x1', 'animateX'],
    ['xy', 'rotated'],
    ['y', 'y1', 'animateY'],
    ['y', 'y2', 'animateY'],
    ['-xy', 'rotated'],
    ['y', 'y3', 'animateY'],
    ['x', 'x2', 'animateX'],
    ['x', 'x3', 'animateX']
];

const gameState = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

startBtn.addEventListener('click', (event) => {
    event.preventDefault()
    playBox.style.display = 'block'
    startBtnBox.style.display = "none"

    setFirstRoundPlayer(starterPlayer);

})

gridBtns.forEach((btn, idx) => {

    btn.addEventListener('click', () => {
        userPlay(btn, idx);
    });
});

restart.addEventListener('click', () => {

    playBox.style.display = 'block'
    startBtnBox.style.display = "none"
    resultBox.style.display = "none";

    setFirstRoundPlayer(starterPlayer);
    resetGame();
})

homeButton.addEventListener("click", () => {
    startBtnBox.style.display = "flex"
    playBox.style.display = 'none'
    resultBox.style.display = "none";
    resetGame();
});


// This function will set first player based on user selection
function setFirstRoundPlayer(player) {

    if (player === "user") {
        activePlayer(user, robot);
        gridBtns.forEach((btn) => {
            btn.disabled = false;
        });
        return;
    }

    if (player === "robot") {
        activePlayer(robot, user);
        setTimeout(() => {
            AIMove(true)
        }, 1000)
        gridBtns.forEach((btn) => {
            btn.disabled = true;
        })
        return;
    }

    const randomPlayerStarter = Math.floor(Math.random() * 1000);
    if (randomPlayerStarter % 3 === 0) {
        console.log("robot random")
        activePlayer(robot, user);
        setTimeout(() => {
            AIMove(true)
        }, 1000)
        gridBtns.forEach((btn) => {
            btn.disabled = true;
        });
    } else {
        console.log("user random")
        activePlayer(user, robot);
        gridBtns.forEach((btn) => {
            btn.disabled = false;
        });
    }
}

// This function will reset game by removing the images from button and set played false
function resetGame() {
    gameState.forEach((cell, idx) => {
        gameState[idx] = " ";
        const img = gridBtns[idx].querySelector('img');
        img.src = ""
        gridBtns[idx].setAttribute('data-played', 'false')
    });
    verticalLine.style.display = "none";
    horizontalLine.style.display = "none";
    crossLeftLine.style.display = "none";
    crossRightLine.style.display = "none";
}

function userPlay(btnElement, index) {

    const img = btnElement.getElementsByTagName('img')[0];
    img.src = 'assets/cross.svg'

    gameState[index] = "X"
    btnElement.setAttribute('data-played', 'true')
    activePlayer(robot, user);
    gridBtns.forEach((btn) => {
        btn.disabled = true
    })
    const winIndex = checkForWinner("X");
    if (winIndex) {
        drawLine(winIndex);
        setTimeout(() => {
            showResults('X')
        }, 2000)
    } else {
        setTimeout(AIMove, 2000)
    }
}

function activePlayer(active, p2) {

    p2.classList.remove('active-user');
    p2.classList.add('deactive-user');
    active.classList.add('active-user');
    active.classList.remove('deactive-user');

}

function AIMove(firstMove) {

    // function that will add Robot move
    const addMove = (index) => {
        const img = gridBtns[index].getElementsByTagName('img')[0];
        img.src = 'assets/circle.svg';
        gameState[index] = "O"
        gridBtns[index].setAttribute('data-played', "true");
    }

    // Check for fill cells and compare with wining patterns 
    const findCellGroupLength = (cells, player) => {
        let fillCell = 0;
        let emptyCell = 0;
        cells.forEach(cell => {
            cell === player ? fillCell++ : cell === " " ? emptyCell++ : emptyCell--
        });
        if (fillCell === 0 || emptyCell === 0) {
            return null
        } else {
            return [fillCell, emptyCell]
        }
    }


    // Get wining cell groups to check user or robot win
    const findCellGroup = (fillCells, player) => {
        let cellsGroup;
        for (let i = 0; i < winPatturn.length; i++) {
            const [a, b, c] = winPatturn[i];
            const cellsState = [gameState[a], gameState[b], gameState[c]]
            const cells = findCellGroupLength(cellsState, player);
            if (cells) {
                if (cells[0] === fillCells && cells[1] > 0) {
                    cellsGroup = winPatturn[i];
                    break;
                }
            }
        }
        return cellsGroup;
    }

    // Random move of the robot after checking for user and robot win
    const fillCellBySearchingEmpty = (cells) => {
        for (let i = 0; i < 3; i++) {
            if (gameState[cells[i]] === " ") {
                addMove(cells[i]);
                break;
            }
        }
    }

    const robotFirstMove = () => {
        let smartFirstPlay = [0, 2, 6, 8];
        Object.values(gridBtns).forEach((btn, idx) => {
            const played = btn.getAttribute("data-played") === "true";
            if (played && smartFirstPlay.includes(idx)) {
                smartFirstPlay = smartFirstPlay.filter(n => n !== idx);
            }
        });
        const randomIndex = smartFirstPlay[Math.floor(Math.random() * 4)];
        addMove(randomIndex);
    }

    // Check if robot have to play first
    if (firstMove) {
        robotFirstMove();
    } else {
        // After first play of the robot

        // For user win
        const userWiningCells = findCellGroup(2, "X");

        // For Robot win
        const robotWin = findCellGroup(2, "O");

        // Check if robot have played two moves already
        const robotCell = findCellGroup(1, "O");


        if (robotWin) {
            // if robot have already two cell add third based on win patherns
            fillCellBySearchingEmpty(robotWin)
        } else if (userWiningCells) {
            // check for user cell, if user have two cells then prevent him from wining
            fillCellBySearchingEmpty(userWiningCells)
        } else if (robotCell) {
            // find first fill cell and add after it based on the win pattern
            fillCellBySearchingEmpty(robotCell);
        } else {
            // check if robot have last move, so find the last empty cell and add there
            const lastCell = gameState.filter(s => s === " ").length
            if (lastCell === 1) {
                const index = gameState.indexOf(' ');
                addMove(index);
            } else {
                robotFirstMove()
            }
        }
    }

    // After each robot move, check for robot win
    const winIndex = checkForWinner('O');
    if (winIndex >= 0) {
        drawLine(winIndex);
        setTimeout(() => {
            showResults('O')
        }, 4000)
        return;
    } else {
        gridBtns.forEach((btn) => {
            const cellenable = btn.getAttribute('data-played');
            if (cellenable === 'false') {
                btn.disabled = false;
            }
        });
        activePlayer(user, robot);
    }

    const allFilled = gameState.filter(emptyCell => emptyCell === " ").length;
    if (allFilled === 0) {
        setTimeout(() => {
            showResults('draw');
        }, 4000)
    }

}

// function that will check for player win
function checkForWinner(player) {
    const win = winPatturn.find(conbination => {
        const [a, b, c] = conbination
        return (gameState[a] === player && gameState[b] === player && gameState[c] === player)
    });

    return win ? winPatturn.indexOf(win) : undefined
}

/// draw win line
function drawLine(index) {

    const verticalLines = [2, 3, 5];
    const horizontalLines = [0, 6, 7];
    const cellWidth = gridBtns[0].clientWidth;
    const cellHeight = gridBtns[0].clientHeight;

    if (verticalLines.includes(index)) {
        const winIndex = verticalLines.indexOf(index)
        const left = (cellWidth * winIndex + winIndex * 4) + (cellWidth / 2);
        verticalLine.style.left = left + "px";
        verticalLine.style.display = "block";
        return;
    }

    if (horizontalLines.includes(index)) {
        const winIndex = horizontalLines.indexOf(index);
        const top = (cellHeight * winIndex + winIndex * 4) + (cellHeight / 2);
        horizontalLine.style.top = top + "px"
        horizontalLine.style.display = "block"
        return;
    }

    if (index === 1) {
        crossLeftLine.style.display = "block"
        return;
    }

    if (index === 4) {
        crossRightLine.style.display = "block"
        return;
    }

}

function showResults(gameWinner) {

    const addImage = (parent, src = "", alt = "") => {
        const img = document.createElement('img');
        img.setAttribute('alt', alt);
        img.setAttribute('src', src);
        parent.appendChild(img);
    }

    playBox.style.display = 'none'
    resultBox.style.display = 'flex'
    winnerBox.innerHTML = "";

    if (gameWinner === "O") {
        resultTitle.textContent = "Oops! The Robot Won"
        addImage(winnerBox, 'assets/robot.png');
        return;
    }

    if (gameWinner === "X") {
        resultTitle.textContent = "Congratulations, You Won!"
        addImage(winnerBox, 'assets/user.png');
        return;
    }

    if (gameWinner === "draw") {
        resultTitle.textContent = "No Winner This Time"
        addImage(winnerBox, 'assets/robot.png');
        addImage(winnerBox, 'assets/user.png');
        return;
    }

}