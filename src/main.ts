let canvas: HTMLCanvasElement
let ctx: CanvasRenderingContext2D
const gBoardHeight = 20
const gBoardWidth = 10
// starting point on board
let startX = 4
let startY = 0
let score = 0
let winOrLose = "Playing"
let coordinateArray: Coordinates[][] = [...Array(gBoardHeight)].map(e => Array(gBoardWidth).fill(0))
let curTetromino: number[][] = [[1,0], [0,1], [1,1], [2,1]]

const tetrominos: number[][][] = []
const tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red']
let curTetrominoColor: string

const gameBoardArray = [...Array(gBoardHeight)].map(e => Array(gBoardWidth).fill(0))

let stoppedShapeArray: (number | string)[][] = [...Array(gBoardHeight)].map(e => Array(gBoardWidth).fill(0))

const DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
}

let direction = DIRECTION.IDLE

class Coordinates {
    public xCoord: number
    public yCoord: number

    constructor(xCoord: number, yCoord: number) {
        this.xCoord = xCoord
        this.yCoord = yCoord
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas)

function CreateCoordinateArray() {
    let i = 0, j = 0
    for (let counter = 9; counter <= 446; counter += 23) {
        for (let counter2 = 11; counter2 <= 264; counter2 += 23) {
            coordinateArray[i][j] = new Coordinates(counter2, counter)
            i++
        }
        j++
        i = 0
    }
}

function SetupCanvas() {
    canvas = <HTMLCanvasElement>document.getElementById('my-canvas')
    ctx = <CanvasRenderingContext2D>canvas.getContext('2d')
    canvas.width = 936
    canvas.height = 956

    ctx.scale(1.5, 1.5)

    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    ctx.strokeStyle = 'black'
    ctx.strokeRect(8, 8, 280, 462)

    // score
    ctx.fillStyle = 'black'
    ctx.font = '21px Arial'
    ctx.fillText("Score", 300, 98)

    ctx.strokeRect(300, 107, 161, 24)

    ctx.fillText(score.toString(), 310, 127)

    ctx.fillText("WIN/LOSE", 300, 221)
    ctx.fillText(winOrLose, 310, 261)
    ctx.strokeRect(300, 232, 161, 95)
    ctx.fillText("CONTROLS", 300, 354)
    ctx.strokeRect(300, 366, 161, 104)
    ctx.font = `19px Arial`
    ctx.fillText("A: Move Left", 310, 388)
    ctx.fillText("D: Move Right", 310, 413)
    ctx.fillText("S: Move Down", 310, 438)
    ctx.fillText("W: Rotate Right", 310, 463)


    document.addEventListener('keydown', HandleKeyPress)
    CreateTetrominos()
    CreateTetromino()

    CreateCoordinateArray()
    DrawTetromino()
}

function DrawTetromino() {
    for (let i = 0; i < curTetromino.length; i++) {
        // location where tetromino shows
        let xCoord = curTetromino[i][0] + startX
        let yCoord = curTetromino[i][1] + startY
        gameBoardArray[xCoord][yCoord] = 1

        let coorX = coordinateArray[xCoord][yCoord].xCoord
        let coorY = coordinateArray[xCoord][yCoord].yCoord
        ctx.fillStyle = curTetrominoColor
        ctx.fillRect(coorX, coorY, 21, 21)
    }
}

function HandleKeyPress(key: KeyboardEvent) {
    if (winOrLose != "Game Over") {
        if (key.keyCode === 65) {
            direction = DIRECTION.LEFT
            if (!HittingTheWall() && !CheckforHorizonalCollision()) {
                DeleteTetromino()
                startX--
                DrawTetromino()
            }
        } else if (key.keyCode === 68) {
            direction = DIRECTION.RIGHT
            if (!HittingTheWall() && !CheckforHorizonalCollision()) {
                DeleteTetromino()
                startX++
                DrawTetromino()
            }
        } else if (key.keyCode === 83) {
            MoveTetrominoDown()
        } else if (key.keyCode === 87) {
            RotateTetromino()
        }
    }
}

function MoveTetrominoDown() {
    if (!CheckForVerticalCollison()) {
        direction = DIRECTION.DOWN
        DeleteTetromino()
        startY++
        DrawTetromino()
    }
}

window.setInterval(function() {
    if (winOrLose != "Game Over") {
        MoveTetrominoDown()
    }
}, 1000)

function DeleteTetromino() {
    for (let counter = 0; counter < curTetromino.length; counter++) {
        let xVal = curTetromino[counter][0] + startX
        let yVal = curTetromino[counter][1] + startY
        gameBoardArray[xVal][yVal] = 0
        let coorX = coordinateArray[xVal][yVal].xCoord
        let coorY = coordinateArray[xVal][yVal].yCoord
        ctx.fillStyle = 'white' // Use white to clear the previous block
        ctx.fillRect(coorX, coorY, 21, 21)
    }
}

function CreateTetrominos() {
    // T
    tetrominos.push([[1,0], [0,1], [1,1], [2,1]])
    // I
    tetrominos.push([[0,0], [1,0], [2,0], [3,0]])
    // J
    tetrominos.push([[0,0], [0,1], [1,1], [2,1]])
    // O
    tetrominos.push([[0,0], [1,0], [0,1], [1,1]])
    // L
    tetrominos.push([[2,0], [0,1], [1,1], [2,1]])
    // Z
    tetrominos.push([[1,0], [2,0], [0,1], [1,1]])
    // S
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]])
}

function CreateTetromino() {
    // Get a random tetromino index
    let randomTetromino = Math.floor(Math.random() * tetrominos.length)
    // Set the one to draw
    curTetromino = tetrominos[randomTetromino]
    // Get the color for it
    curTetrominoColor = tetrominoColors[randomTetromino]
}


function HittingTheWall() {
    for (let i = 0; i < curTetromino.length; i++) {
        let newX = curTetromino[i][0] + startX
        if (newX <= 0 && direction === DIRECTION.LEFT) {
            return true
        } else if (newX >= 11 && direction == DIRECTION.RIGHT) {
            return true
        }
    }
    return false
}

function CheckForVerticalCollison() {
    let tetrominoCopy = curTetromino;
    let collision = false;

    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i];
        let x = square[0] + startX;
        let y = square[1] + startY;

        if (direction === DIRECTION.DOWN) {
            y++;
        }

        // Check if it hits the bottom of the board
        if (y >= gBoardHeight) {
            collision = true;
            break;
        }

        // Check if it hits a stopped shape
        if (y < gBoardHeight && gameBoardArray[x][y] === 1) {
            if (typeof stoppedShapeArray[x][y] === 'string') {
                collision = true;
                break;
            }
        }
    }

    if (collision) {
        if (startY <= 2) {
            winOrLose = "Game Over";
            ctx.fillStyle = 'white';
            ctx.fillRect(310, 242, 140, 30);
            ctx.fillStyle = "black";
            ctx.fillText(winOrLose, 310, 261);
        } else {
            for (let i = 0; i < tetrominoCopy.length; i++) {
                let square = tetrominoCopy[i];
                let x = square[0] + startX;
                let y = square[1] + startY;
                stoppedShapeArray[x][y] = curTetrominoColor;
            }
            CheckForCompletedRows();
            CreateTetromino();
            direction = DIRECTION.IDLE;
            startX = 4;
            startY = 0;
            DrawTetromino();
        }
    }

    return collision;
}


function CheckforHorizonalCollision() {
    let tetrominoCopy = curTetromino
    let collision = false
    for (let i = 0; i < tetrominoCopy.length; i++) {
        let square = tetrominoCopy[i]
        let x = square[0] + startX
        let y = square[1] + startY

        if (direction === DIRECTION.LEFT) {
            x--
        } else if (direction === DIRECTION.RIGHT) {
            x ++
        }
        let stoppedShapeArrayVal = stoppedShapeArray[x][y]
        if (typeof stoppedShapeArrayVal === 'string') {
            collision = true
            break
        }
    }
    return collision
}

function CheckForCompletedRows() {
    let rowsToDelete = 0
    let startOfDeletion = 0
    for (let y = 0; y < gBoardHeight; y++) {
        let completed = true
        for (let x = 0; x < gBoardWidth; x++) {
            let square = stoppedShapeArray[x][y]
            if (square === 0 || (typeof square === 'undefined')) {
                completed = false
                break
            }
        }
        if (completed) {
            if (startOfDeletion === 0 ) {
                rowsToDelete++
                for (let i =0; i < gBoardWidth; i++) {
                    stoppedShapeArray[i][y] = 0
                    gameBoardArray[i][y] = 0
                    let coorX = coordinateArray[i][y].xCoord
                    let coorY = coordinateArray[i][y].yCoord
                    ctx.fillStyle = 'white'
                    ctx.fillRect(coorX, coorY, 21, 21)
                }
            }
        }
    }
    if (rowsToDelete > 0) {
        score += 10
        ctx.fillStyle = 'white'
        ctx.fillRect(310, 109, 140, 19)
        ctx.fillStyle = 'black'
        ctx.fillText(score.toString(), 310, 127)
        MoveAllRowsDown(rowsToDelete, startOfDeletion)
    }
}

function MoveAllRowsDown(rowsToDelete: number, startOfDeletion: number) {
    for (let i = startOfDeletion-1; i >= 0; i--) {
        for (let x = 0; x < gBoardWidth; x++) {
            let y2 = i + rowsToDelete
            let square = stoppedShapeArray[x][i]
            let nextSquare = stoppedShapeArray[x][y2]
            if (typeof square === 'string') {
                nextSquare = square
                gameBoardArray[x][y2] = 1
                stoppedShapeArray[x][y2] = square
                let coorX = coordinateArray[x][y2].xCoord
                let coorY = coordinateArray[x][y2].yCoord
                ctx.fillStyle = nextSquare
                ctx.fillRect(coorX, coorY, 21, 21)

                square = 0
                gameBoardArray[x][i] = 0
                stoppedShapeArray[x][i] = 0
                coorX = coordinateArray[x][i].xCoord
                coorY = coordinateArray[x][i].yCoord
                ctx.fillStyle = 'white'
                ctx.fillRect(coorX, coorY, 21, 21)
            }

        }
    }
}

function RotateTetromino() {
    let newRotation: number[][] = [];
    let tetrominoCopy = curTetromino;
    let curTetrominoBU: number[][] = [...curTetromino]; // backup

    for (let i = 0; i < tetrominoCopy.length; i++) {
        let x = tetrominoCopy[i][0];
        let y = tetrominoCopy[i][1];
        let newX = GetLastSquareX() - y;
        let newY = x;
        newRotation.push([newX, newY]);
    }

    DeleteTetromino();
    try {
        curTetromino = newRotation;
        DrawTetromino();
    } catch (e) {
        if (e instanceof TypeError) {
            curTetromino = curTetrominoBU;
            DeleteTetromino();
            DrawTetromino();
        }
    }
}


function GetLastSquareX() {
    let lastX = 0 
    for (let i = 0 ; i < curTetromino.length; i++) {
        let square = curTetromino[i]
        if (square[0] > lastX)
            lastX = square[0]
    }
    return lastX
}