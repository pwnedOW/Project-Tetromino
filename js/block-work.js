import BLOCKS from './blocks.js'

// DOM
const innerDisplay = document.querySelector('.inner-display > ul');
const gameText = document.querySelector('.game-text');
const scoreDisplay = document.querySelector('.score');
const restartButton = document.querySelector('.game-text > button');
// setting
const GAME_ROWS = 25;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;


const movingItem = {
    type: '',
    direction: 0,
    top: 0,
    left: 0,
}

init()

// functions
function init(){
    tempMovingItem = { ...movingItem };
    for (let i = 0; i < GAME_ROWS; i++) {
        prependNewLine()
    }
    generateNewBlock()
}


function prependNewLine(){
    const li = document.createElement('li');
    const ul = document.createElement('ul');
    for(let j = 0; j < GAME_COLS; j++){
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
        li.prepend(ul);
        innerDisplay.prepend(li);
}

function renderBlocks(moveType=''){
    const { type, direction, top, left } = tempMovingItem;
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove(type, "moving")
    })
    
    BLOCKS[type][direction].some(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = innerDisplay.childNodes[y] ? innerDisplay.childNodes[y].childNodes[0].childNodes[x] : null;
        const isAvailable = checkEmpty(target); 
        if(isAvailable) {
            target.classList.add(type, "moving")
        } else {
            tempMovingItem = { ...movingItem }
            if(moveType ==='retry'){
                clearInterval(downInterval);
                showGameoverText();
            }
            setTimeout(()=>{
                renderBlocks('retry');
                if(moveType ==="top"){
                    seizeBlock();
                }
            }, 0)
            return true;
        }
        
    })
    movingItem.left = left;
    movingItem.top = top;
    movingItem.direction = direction;
}
function seizeBlock(){
    const movingBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        moving.classList.remove("moving");
        moving.classList.add("seized");
    })
    checkMatch();
}
function checkMatch(){
    const childNodes = innerDisplay.childNodes;
    childNodes.forEach(child=>{
        let matched = true;
        child.children[0].childNodes.forEach(li=>{
            if(!li.classList.contains('seized')){
                matched = false;
            }
        })
        if(matched){
            child.remove();
            prependNewLine()
            score++;
            scoreDisplay.innerText = score;
        }
    })
    generateNewBlock()
}
function generateNewBlock(){

    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top', 1)
    }, duration)

    const blockArray = Object.entries(BLOCKS);
    const randomIndex = Math.floor(Math.random() * blockArray.length)
    movingItem.type = blockArray[randomIndex][0]
    movingItem.top = 0;
    movingItem.left = 4;
    movingItem.direction = 0;
    tempMovingItem = {...movingItem};
    renderBlocks()
}

function checkEmpty(target){
    if(!target || target.classList.contains('seized')){
        return false;
    }
    return true;
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks(moveType);
}
function changeDirection(){
    const direction = tempMovingItem.direction;
    direction === 3 ? tempMovingItem.direction =0 : tempMovingItem.direction += 1;
    renderBlocks()
}
function dropBlock(){
    clearInterval(downInterval);
    downInterval = setInterval(()=>{
        moveBlock('top', 1)
    }, 10)
}
function showGameoverText(){
    gameText.style.display = 'flex'
}

// event handling
document.addEventListener('keydown', e =>{
    switch(e. keyCode){
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
        case 32:
            dropBlock();
            break;
        default:
            break;
    }
})

restartButton.addEventListener('click', ()=>{
    innerDisplay.innerHTML = '';
    gameText.style.display = "none"
    init()
})