import Game from "./Game.js"

let canvas = document.querySelector('#canvas')
let ctx = canvas.getContext('2d')
let testMode = false
let easyMode = false
let speedMode = true
let game = new Game(canvas, testMode, easyMode, speedMode)

localStorage.clear()

game.display()

if(testMode) {
    game.makeTestBricks()
} else {
    game.makeBricks()
}

game.allEvents()


