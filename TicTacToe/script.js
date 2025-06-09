const gridBtns = document.querySelectorAll('.grid-btn');
const robot = document.getElementById('robot');
const user = document.getElementById('user');
const startBtn = document.getElementById('start-btn');
const gameGrid = document.getElementById('game-grid');
const playBox = document.getElementById('play-box')
const winingLine = document.getElementById('wining-line');
const startBtnBox = document.getElementById('startBtn-box');
const resultTitle = document.getElementById('result-title');
const winnerBox = document.getElementById('winner-box');
const restart = document.getElementById('restart');
const resultBox = document.getElementById('result-box');

let playTime = 'robot'
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
]

const gameState = [" ", " ", " ", " ", " ", " ", " ", " ", " "];

startBtn.addEventListener('click', (event) => {
    event.preventDefault()
    playBox.style.display = 'block'
    startBtnBox.style.display = "none"

    activePlayer(robot, user)
    setTimeout(() => {
        AIMove(true)
    }, 1000)
    gridBtns.forEach((btn) => {
        btn.disabled = true;
    })
})

gridBtns.forEach((btn, idx) => {

    btn.addEventListener('click', () => {
        userPlay(btn, idx);
    });
});

restart.addEventListener('click', () => {

    winingLine.className = "wining-line";
    playBox.style.display = 'block'
    startBtnBox.style.display = "none"
    resultBox.style.display = "none";
    setTimeout(() => {
        AIMove(true)
    }, 1000)
    activePlayer(robot, user)

    gameState.forEach((cell, idx) => {
        gameState[idx] = " ";
        const img = gridBtns[idx].querySelector('img');
        img.src = ""
        gridBtns[idx].setAttribute('data-played', 'false')
    })
})

function userPlay(btnElement, index) {

    const img = btnElement.getElementsByTagName('img')[0];

    img.src = 'cross.svg'
    gameState[index] = "X"
    btnElement.setAttribute('data-played', 'true')
    activePlayer(robot, user);
    btnElement.disabled = true;
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
        setTimeout(AIMove, 1000)
    }
}

function activePlayer(active, p2) {

    p2.classList.remove('active-user');
    p2.classList.add('deactive-user');
    active.classList.add('active-user');
    active.classList.remove('deactive-user');

}

function AIMove(firstMove) {

    const addMove = (index) => {
        const img = gridBtns[index].getElementsByTagName('img')[0];
        img.src = 'circle.svg';
        gameState[index] = "O"
        activePlayer(user, robot);
        gridBtns[index].setAttribute('data-played', "true");
    }

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

    const fillCellBySearchingEmpty = (cells) => {
        for (let i = 0; i < 3; i++) {
            if (gameState[cells[i]] === " ") {
                addMove(cells[i]);
                break;
            }
        }
    }

    if (firstMove) {
        const smartFirstPlay = [0, 2, 6, 8]
        const randomIndex = smartFirstPlay[Math.floor(Math.random() * 4)];
        addMove(randomIndex);
    } else {
        const userCells = findCellGroup(2, "X");
        const robotWin = findCellGroup(2, "O");
        const robotCell = findCellGroup(1, "O");
        if (robotWin) {
            fillCellBySearchingEmpty(robotWin)
        } else if (userCells) {
            fillCellBySearchingEmpty(userCells)
        } else if (robotCell) {
            fillCellBySearchingEmpty(robotCell);
        } else {
            const lastCell = gameState.filter(s => s === " ").length
            if (lastCell === 1) {
                const index = gameState.indexOf(' ');
                addMove(index);
            }
        }
    }

    const winIndex = checkForWinner('O');
    if (winIndex >= 0) {
        drawLine(winIndex);
        console.log("runing", winIndex);
        setTimeout(() => {
            showResults('O')
        }, 2000)
    }

    const allFilled = gameState.filter(emptyCell => emptyCell === " ").length;
    if (allFilled === 0) {
        setTimeout(() => {
            showResults('draw');
        }, 2000)
    }

    gridBtns.forEach((btn) => {
        const cellenable = btn.getAttribute('data-played');
        if (cellenable === 'false') {
            btn.disabled = false;
        }
    })
}

function checkForWinner(player) {

    const win = winPatturn.find(conbination => {
        [a, b, c] = conbination
        return (gameState[a] === player && gameState[b] === player && gameState[c] === player)
    });

    return win ? winPatturn.indexOf(win) : undefined
}

function drawLine(index) {
    winingLines[index]?.forEach(className => {
        winingLine.classList.add(className);
    })
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
        addImage(winnerBox, 'circle.svg');
        return;
    }

    if (gameWinner === "X") {
        resultTitle.textContent = "Congratulations, You Won!"
        addImage(winnerBox, 'cross.svg');
        return;
    }

    if (gameWinner === "draw") {
        resultTitle.textContent = "No Winner This Time"
        addImage(winnerBox, 'cross.svg');
        addImage(winnerBox, 'circle.svg');
        return;
    }

}