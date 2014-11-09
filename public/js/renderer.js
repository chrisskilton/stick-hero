var canvas = document.querySelector('.canvas');
var context = canvas.getContext('2d');
var columns = [];
var mode = 'easy';
var COLUMN_HEIGHT =  200;
var COLUMN_WIDTHS = {
    easy: [50, 75, 100, 150]
};
var COLUMN_DISTANCES = [25, 50, 75, 100, 150, 200];
var columnDistance = 200;
var ladderLength = 0;
var bridgeExists = false;
var bridgeLongEnough = false;
var mouseDown = false;
var gameState = 0;
var levelMove = null;

var score = 0;

function getRandom(array) {
    return array[Math.floor(Math.random()*array.length)];
}

function createColumn() {
    return {
        height: COLUMN_HEIGHT,
        width: getRandom(COLUMN_WIDTHS[mode])
    };
}

function updateColumns() {
    if (columns.length === 2){
        return;
    }

    while (columns.length < 2){
        columns.push(createColumn());
    }

    renderColumns();
}

function renderColumns() {
    columnDistance = getRandom(COLUMN_DISTANCES);

    context.fillStyle = 'black';
    context.fillRect(50, canvas.height - columns[0].height, columns[0].width, columns[0].height);

    context.fillStyle = 'black';
    context.fillRect(50 + columnDistance + columns[0].width, canvas.height - columns[1].height, columns[1].width, columns[0].height);
}

function renderLadder() {
    context.fillStyle = 'grey';
    context.fillRect(columns[0].width+48, canvas.height - columns[0].height - ladderLength, 2, ladderLength);
}

function clearLadder() {
    context.clearRect(columns[0].width+48, canvas.height - columns[0].height - ladderLength, 2, ladderLength);
    ladderLength = 0;
}

function renderBridge(){
    context.fillStyle = 'grey';
    context.fillRect(columns[0].width+48, canvas.height - columns[0].height, ladderLength, 2);

    bridgeExists = true;
    bridgeLongEnough = ladderLength >= columnDistance && ladderLength < columnDistance + columns[1].width;
}

function updateLadder() {
    if (!mouseDown && !ladderLength){
        return;
    }

    if (mouseDown){
        ladderLength += 5;
        renderLadder();

        return;
    }

    renderBridge();
    clearLadder();
}

function updateRunner() {
    context.clearRect(0, 0, canvas.width, canvas.height - columns[0].height);

    if (!bridgeExists){
        context.beginPath();
        context.arc(50 + columns[0].width/2, canvas.height - columns[0].height - 10, 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();

        return;
    }

    if (bridgeLongEnough){
        context.beginPath();
        context.arc(50 + columns[1].width /2, canvas.height - columns[1].height - 10, 10, 0, 2 * Math.PI, false);
        context.fillStyle = 'green';
        context.fill();

        return;
    }

    context.beginPath();
    context.arc(50 + columns[0].width + columnDistance/2, canvas.height - 40, 10, 0, 2 * Math.PI, false);
    context.fillStyle = 'red';
    context.fill();
}

function updateLevel() {
    var level;

    if (!bridgeExists){
        return;
    }

    if (!bridgeLongEnough){
        context.fillStyle = 'red';
        context.font = 'bold 40px Arial';
        context.textAlign = 'center';
        context.fillText('GAME OVER', canvas.width/2, canvas.height/2);

        return;
    }

    if (bridgeExists && levelMove === null){
        levelMove = columns[0].width + columnDistance;
    }

    if (levelMove <= 0){
        resetLevel();
        return;
    }

    level = context.getImageData(5, 0, canvas.width -5, canvas.height);
    context.putImageData(level, 0, 0);

    context.clearRect(canvas.width-5, 0, 5, canvas.height);

    levelMove -= 5;
}

function resetLevel() {
    console.log('resetting');
    bridgeExists = false;
    ladderLength = 0;
    bridgeLongEnough = false;
    gameState = 0;
    levelMove = null;
    columns.shift();

    score++;

    context.clearRect(0, 0, canvas.width, canvas.height);
}

function updateScore() {
    context.fillStyle = 'black';
    context.font = 'bold 40px Arial';
    context.fillText(score, canvas.width - 50, 50);
}

function draw() {
    updateColumns();

    updateRunner();

    updateLadder();

    updateLevel();

    updateScore();

    window.requestAnimationFrame(draw);
}

window.requestAnimationFrame(draw);


document.addEventListener('mousedown', function() {
    mouseDown = true;
    console.log(mouseDown);
});

document.addEventListener('mouseup', function() {
    mouseDown = false;
    console.log(mouseDown);
});