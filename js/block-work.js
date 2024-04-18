import BLOCKS from './blocks.js'

// DOM
const innerDisplay = document.querySelector('.inner-display > ul');
const gameText = document.querySelector('.game-text');
const scoreDisplay = document.querySelector('.score');
const startButton = document.querySelector('.start');
const displayContainer = document.querySelector('.display-container');
const nextbox = document.querySelector('.nextbox > ul');
const powerButton = document.querySelector('.power-button');


// setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;
let gameover = false;
let nextBlock;
let replay = false;
let randomBox = [0, 1, 2, 3, 4, 5, 6];

const movingItem = {
    type: '',
    direction: 0,
    top: 0,
    left: 0
}

const BLOCKBOX = [
    ['tree', [[3, 1], [1, 1], [2, 0], [2, 1]]],
    ['square', [[1, 0], [1, 1], [2, 0], [2, 1]]],
    ['bar', [[1, 1], [2, 1], [3, 1], [4, 1]]],
    ['zee', [[1, 0], [2, 0], [2, 1], [3, 1]]],
    ['see', [[3, 0], [2, 0], [2, 1], [1, 1]]],
    ['elLeft', [[1, 0], [1, 1], [2, 1], [3, 1]]],
    ['elRight', [[1, 1], [2, 1], [3, 1], [3, 0]]]
]

init();

// functions
function init() {
    gameText.style.display = "none"
    startButton.classList.remove('blink')
    gameover = false;
    score = 0;
    scoreDisplay.innerText = score;
    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    if (replay) {
        const movingBlocks = document.querySelectorAll('.next');
        movingBlocks.forEach(express => {
            express.classList.remove(BLOCKBOX[nextBlock][0], 'next');
        })
    } else {
        for (let i = 0; i < 2; i++) {
            prependBox(nextbox);
        }
    }
    nextBlock = randomDecide();
    BLOCKBOX[nextBlock][1].some(block => {
        const x = block[0];
        const y = block[1];
        for (let i = 0; i < 4; i++) {
            nextbox.childNodes[y].childNodes[0].childNodes[x].classList.add(BLOCKBOX[nextBlock][0], 'next');
        }
    })
    generateNewBlock();
}

function prependBox(obj) {
    const li = document.createElement('li');
    const ul = document.createElement('ul');
    for (let j = 0; j < 5; j++) {
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
    li.prepend(ul);
    obj.prepend(li);
}

function prependNewLine() {
    const li = document.createElement('li');
    const ul = document.createElement('ul');
    for (let j = 0; j < GAME_COLS; j++) {
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
    li.prepend(ul);
    innerDisplay.prepend(li);
}

function generateNewBlock() {

    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1)
    }, duration)

    const blockArray = Object.entries(BLOCKS);
    movingItem.type = blockArray[nextBlock][0]
    nextBlock = randomDecide();
    movingItem.top = 0;
    movingItem.left = 4;
    movingItem.direction = 0;
    tempMovingItem = { ...movingItem };
    const movingBlocks = document.querySelectorAll('.next');
    movingBlocks.forEach(express => {
        express.classList.remove(movingItem.type, 'next');
    })
    BLOCKBOX[nextBlock][1].some(block => {
        const x = block[0];
        const y = block[1];
        for (let i = 0; i < 4; i++) {
            nextbox.childNodes[y].childNodes[0].childNodes[x].classList.add(BLOCKBOX[nextBlock][0], 'next');
        }
    })
    renderBlocks()
}

function randomDecide() {
    if (randomBox.length < 1) {
        for (let i = 0; i < 7; i++) {
            randomBox.push(i);
        }
    }
    let randoms = Math.floor(Math.random() * randomBox.length);
    let ans = randomBox[randoms];
    randomBox.splice(randoms, 1);
    return ans;
}

function checkEmpty(target) {
    if (!target || target.classList.contains('seized')) {
        return false;
    }
    return true;
}

function renderBlocks(moveType = '') {
    let possible = true;
    const { type, direction, top, left } = tempMovingItem;
    const arr = [];
    BLOCKS[type][direction].some(block => {
        const x = block[0] + left;
        const y = block[1] + top;
        const target = innerDisplay.childNodes[y] ? innerDisplay.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target);
        arr.push([x, y]);
        if (!isAvailable) {
            possible = false;
        }
    })
    if (possible) {
        const movingBlocks = document.querySelectorAll('.moving');
        movingBlocks.forEach(moving => {
            moving.classList.remove(type, "moving");
        })
        for (let i = 0; i < 4; i++) {
            innerDisplay.childNodes[arr[i][1]].childNodes[0].childNodes[arr[i][0]].classList.add(type, 'moving');
        }
        movingItem.left = left;
        movingItem.top = top;
        movingItem.direction = direction;
    } else {
        tempMovingItem = { ...movingItem }
        if (moveType === 'retry') {
            clearInterval(downInterval);
            gameover = true;
            showGameoverText();
            startButton.classList.add('blink');
            return true;
        }

        if (moveType === "top") {
            seizeBlock();
        }

        renderBlocks('retry');

        return true;
    }
}

function seizeBlock() {
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add('wave');
        moving.classList.add("seized");
    })
    checkMatch();
}
function checkMatch() {
    let bonus = 0;
    const childNodes = innerDisplay.childNodes;
    childNodes.forEach(child => {
        let matched = true;
        child.children[0].childNodes.forEach(li => {
            if (!li.classList.contains('seized')) {
                matched = false;
            }
        })
        if (matched) {
            child.remove();
            prependNewLine();
            bonus++;
        }
    })
    if (bonus > 0) {
        score += bonus ** 2 * 10;
        scoreDisplay.innerText = score;
    }

    generateNewBlock()
}

function moveBlock(moveType, amount) {
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}
function changeDirection() {
    const direction = tempMovingItem.direction;
    const left = tempMovingItem.left;
    const type = tempMovingItem.type;
    direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
    switch (type) {
        case 'tree':
            if (left == -1 && direction == 3) {
                tempMovingItem.left++;
                break;
            }
            if (left == 8 && direction == 1) {
                tempMovingItem.left--;
                break;
            }
            break;
        case 'bar':
            if (direction % 2 == 1) {
                if (left == -2) {
                    tempMovingItem.left += 2;
                    break;
                }
                if (left == -1) {
                    tempMovingItem.left++;
                    break;
                }
                if (left == 7) {
                    tempMovingItem.left--;
                    break;
                }
            }
            break;
        case 'zee':
            if (left == 8 && direction % 2 == 1) {
                tempMovingItem.left--;
                break;
            }
            break;
        case 'see':
            if (left == 8 && direction % 2 == 1) {
                tempMovingItem.left--;
                break;
            }
            break;
        case 'elLeft':
            if (left == -1 && direction == 3) {
                tempMovingItem.left++;
                break;
            }
            if (left == 8 && direction == 1) {
                tempMovingItem.left--;
                break;
            }
            break;
        case 'elRight':
            if (left == -1 && direction == 3) {
                tempMovingItem.left++;
                break;
            }
            if (left == 8 && direction == 1) {
                tempMovingItem.left--;
                break;
            }
            break;
        default:
            break;
    }
    renderBlocks()
}
function dropBlock() {
    clearInterval(downInterval);
    downInterval = setInterval(() => {
        moveBlock('top', 1)
    }, 10)
}
function showGameoverText() {
    gameText.style.display = 'flex'
}

// event handling
document.addEventListener('keydown', e => {
    if (!gameover) {
        switch (e.keyCode) {
            case 39: // 오른쪽 화살표
                moveBlock("left", 1);
                break;
            case 37: // 왼쪽 화살표
                moveBlock("left", -1);
                break;
            case 40: // 아래 화살표
                moveBlock("top", 1);
                break;
            case 38: // 위 화살표
                changeDirection();
                break;
            case 90: // z
                changeDirection();
                break;
            case 67: // c
                dropBlock();
                break;
            case 32: // 스페이스 바
                dropBlock();
                break;
            case 82: // r
                innerDisplay.innerHTML = '';
                gameText.style.display = "none"
                replay = true;
                init();
                break;
            default:
                break;
        }
    }
    if (gameover) {
        switch (e.keyCode) {
            case 82: // r
                innerDisplay.innerHTML = '';
                gameText.style.display = "none"
                replay = true;
                init();
                break;
            default:
                break;
        }
    }
})
window.addEventListener("keydown", (e) => {
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

document.querySelector('.arrow-up').addEventListener('click', (e) => {
    if (!gameover) {
        changeDirection();
    }
})
document.querySelector('.arrow-down').addEventListener('click', (e) => {
    if (!gameover) {
        moveBlock('top', 1);
    }
})
document.querySelector('.arrow-left').addEventListener('click', (e) => {
    if (!gameover) {
        moveBlock('left', -1);
    }
})
document.querySelector('.arrow-right').addEventListener('click', (e) => {
    if (!gameover) {
        moveBlock('left', 1);
    }
})
document.querySelector('.buttonA').addEventListener('click', (e) => {
    if (!gameover) {
        changeDirection();
    }
})
document.querySelector('.buttonB').addEventListener('click', (e) => {
    if (!gameover) {
        dropBlock();
    }
})
document.querySelector('.keyinfo-btn').addEventListener('click', (e) => {
    let speechBubble = document.querySelector('.speech-bubble')
    speechBubble.classList.toggle('invisible');
    speechBubble.classList.add('power-on');
})
document.querySelector('.select').addEventListener('click', (e) => {
    displayContainer.requestFullscreen();
    if(displayContainer.requestFullscreen()) {
    innerDisplay.style.width = '480px';
    innerDisplay.style.height = '960px';
    }
})
startButton.addEventListener('click', (e) => {
    innerDisplay.innerHTML = '';
    gameText.style.display = "none";
    replay = true;
    init();
})
powerButton.addEventListener('click', (e) => {
    document.querySelector('.battery-LED').classList.toggle('invisible');
    document.querySelector('.battery-LED').classList.toggle('power-on');
    document.querySelector('.off-switch').classList.toggle('invisible');
    document.querySelector('.on-hider').classList.toggle('invisible');
    document.querySelector('.click-alert').style.display = 'none';
    displayContainer.classList.toggle('invisible');
    displayContainer.classList.toggle('power-on');
    innerDisplay.innerHTML = '';
    gameText.style.display = "none";
    replay = true;
    init();
})




// document.addEventListener('mousemove', (event) => {
// 	console.log(event.clientX, event.clientY);
// });
