// DOM
const innerDisplay = document.querySelector('.inner-display > ul');

// setting
const GAME_ROWS = 20;
const GAME_COLS = 10;

// variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const BLOCKS = {
    tree: [
        [[2,1], [0,1], [1,0], [1,1]],
        [],
        [],
        [],
    ]
}

const movingItem = {
    type: 'tree',
    direction: 0,
    top: 0,
    left: 0,
}

init()

// functions
function init(){
    tempMovingItem = { ...movingItem };
    for (let i = 0; i < 20; i++) {
        prependNewLine()
    }
    renderBlocks()
}


function prependNewLine(){
    const li = document.createElement('li');
    const ul = document.createElement('ul');
    for(let j = 0; j < 10; j++){
        const matrix = document.createElement('li');
        ul.prepend(matrix);
    }
        li.prepend(ul);
        innerDisplay.prepend(li);
}

function renderBlocks(){
    const { type, direction, top, left } = tempMovingItem;
    const moveBlocks = document.querySelectorAll('.moving');
    movingBlocks.forEach(moving => {
        
    })
    
    BLOCKS[type][direction].forEach(block=>{
        const x = block[0] + left;
        const y = block[1] + top;
        const target = innerDisplay.childNodes[y].childNodes[0].childNodes[x];
        target.classList.add(type, "moving")
    })
}
function moveBlock(moveType, amount){
    tempMovingItem[moveType] += amount;
    renderBlocks()
}
// event handling
document.addEventListener('keydown', e =>{
    switch(e,keyCode){
        case 39:
            moveBlock("left", 1);
            break;
        case 37:
            moveBlock("left",-1);
        default:
            break;
    }
})