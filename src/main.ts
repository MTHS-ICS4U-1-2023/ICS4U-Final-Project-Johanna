let canvas
let ctx: CanvasRenderingContext2D
let gBoardHeight = 20
let gBoardWidth = 10
// starting point on board
let startX = 4
let startY = 0
let coodinateArray: Coordinates[][] = [...Array(gBoardHeight)].map(e => Array(gBoardWidth)
.fill(0))
let curTetromino: number[][] = [[1,0], [0,1], [1,1], [2,1]]

let tetrominos: number[][][] = []
let tetrominoColors = ['purple', 'cyan', 'blue', 'yellow', 'orange', 'green', 'red']
let curTetrominoColor: string

let gameBoardArray = [...Array(gBoardHeight)].map(e => Array(gBoardWidth).fill(0))

let DIRECTION = {
    IDLE: 0,
    DOWN: 1,
    LEFT: 2,
    RIGHT: 3,
}

let direction

class Coordinates{
    public xCoord: number
    public yCoord: number

    constructor(xCoord: number,yCoord: number){
        this.xCoord = xCoord
        this.yCoord = yCoord
    }
}

document.addEventListener('DOMContentLoaded', SetupCanvas)

function CreateCoodArray() {
    let i = 0, j = 0
    for(let counter = 9; counter <= 446; counter += 23) {
        for(let counter2 = 11; counter2 <= 264; counter2 += 23) {
            coodinateArray[i][j] = new Coordinates(counter2,counter)
            i++
        }
        j++
        i = 0
    }
}

function SetupCanvas(){
    const canvas = <HTMLCanvasElement> document.getElementById('my-canvas')
    const ctx = <CanvasRenderingContext2D> canvas.getContext('2d') 
    canvas.width = 936
    canvas.height = 956

    ctx.scale(1.5,1.5)

    ctx.fillStyle = 'white'
    ctx.fillRect(0,0,canvas.width, canvas.height)

    ctx.strokeStyle = 'black'
    ctx.strokeRect(8,8,280,462)

    document.addEventListener('keydown', HandleKeyPress)
    CreateTetrominos()
    //CreateTetromino()

    CreateCoodArray()
    DrawTetromino()
}

function DrawTetromino() {
    for(let i = 0; i < curTetromino.length; i++) {
        // location where tetromino shows
        let xCoord = curTetromino[i][0] + startX
        let yCoord = curTetromino[i][1] + startY
        gameBoardArray[xCoord][yCoord] = 1

        let coorX = coodinateArray[xCoord][yCoord].xCoord
        let coorY = coodinateArray[xCoord][yCoord].yCoord
        ctx.fillStyle = curTetrominoColor
        ctx.fillRect(coorX, coorY, 21, 21)
    }
}

function HandleKeyPress(key: KeyboardEvent) {
    if(key.keyCode === 65) {
        direction = DIRECTION.LEFT
        DeleteTetromino()
        startX--
        DrawTetromino()
    } else if (key.keyCode === 68) {
        direction = DIRECTION.RIGHT
        DeleteTetromino()
        startX++
        DrawTetromino()
    } else if (key.keyCode === 83) {
        direction = DIRECTION.DOWN
        DeleteTetromino()
        startY++
        DrawTetromino()
    }
}

function DeleteTetromino() {
    for(let counter = 0; counter < curTetromino.length; counter++) {
        let xVal = curTetromino[counter][0] + startX
        let yVal = curTetromino[counter][1] + startY
        gameBoardArray[xVal][yVal] = 0
        let coorX = coodinateArray[xVal][yVal].xCoord
        let coorY = coodinateArray[xVal][yVal].yCoord
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
    // Z
    tetrominos.push([[0,0], [1,0], [1,1], [2,1]])
}

function CreateTetromino() {
    // Get a random tetromino index
    let randomTetromino = Math.floor(Math.random() * tetrominos.length);
    // Set the one to draw
    curTetromino = tetrominos[randomTetromino];
    // Get the color for it
    curTetrominoColor = tetrominoColors[randomTetromino];
}