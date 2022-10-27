import Ball from "./Ball.js"
import Paddle from "./Paddle.js"
import Brick from "./Brick.js"

let logLevel = 3

function log(msg, level) {

    if (level <= logLevel) return console.log(msg);

}

class Game {

    constructor(canvas, testMode, easyMode, speedMode) {
        this.background = "#DDDDDD"
        this.canvasDom = canvas
        this.ctx = this.canvasDom.getContext('2d')
        this.testMode = testMode
        this.easyMode = easyMode
        this.speedMode = speedMode
        this.ball = new Ball(this.canvasDom, this.testMode, this.speedMode)
        this.paddle = new Paddle(this.canvasDom, this.easyMode, this.speedMode)
        this.animationId = null
        this.animationInit = null
        this.start = false
        this.pause = false
        this.gameOver = false
        this.bricks = []
        this.remainingBricks = 1
        this.qtyBricks = 1
        this.bricksPerRow = 8
        this.minColumnMargin = 5
        this.rowMargin = parseInt(this.canvasDom.height / 60)
        this.brickWidth = parseInt(this.canvasDom.width / (this.bricksPerRow+1))
        this.brickHeight = parseInt(this.canvasDom.height / 25)
        this.bricksDrawn = false
        this.timeStart = Date.now()
        this.timeElapsed = Date.now()
        this.gameTime,
        this.gameCompleted = false
        this.games = JSON.parse(localStorage.getItem('Games')) || []
        
    }

    allEvents() {
        document.addEventListener('keydown', this.keyboardEvent.bind(this))
    }

    keyboardEvent(e) {
        switch(e.key) {
            case 'ArrowRight':
                e.preventDefault()
                this.paddle.move(1, this.canvasDom.width)
                break
            case 'ArrowLeft':
                e.preventDefault()
                this.paddle.move(-1, this.canvasDom.width)
                break
            case 'r':
                e.preventDefault()
                if (this.gameOver === true) {
                    log('0',4);
                    this.initPositions()
                    this.gameOver = false
                    this.start = false
                    this.pause = true
                } else {
                    if (!this.start) {
                        log('1',4)
                        this.start = true
                        this.pause = false
                        log('Start play from 1');
                        this.play()
                        this.timeStart = Date.now()
                    } else {
                        if (this.pause === true) {
                            log('2',4)
                            this.start = true
                            this.pause = false
                            log('Start play from 2');
                            this.play()
                        } else {
                            log('3',4)
                            this.pause = true
                        }
                    }
                    
                }
                break
            case 'i':
                this.initPositions()
        }
    }

    initPositions() {
        // log('Initialising positions');
        this.ball.x = parseInt(this.paddle.x + this.paddle.width / 2)
        this.ball.y = parseInt(this.canvasDom.height * 0.8)

        if (this.ball.x <= 0.33 * this.canvasDom.width) {
            this.ball.dirX = -1
            this.ball.dirY = -1
        } else if (this.ball.x <= 0.66 * this.canvasDom.width) {
            this.ball.dirX = 0
            this.ball.dirY = -1
        } else {
            this.ball.dirX = 1
            this.ball.dirY = -1
        }
        
        this.display()
        
        this.animationInit = requestAnimationFrame(this.initPositions.bind(this))
    }

    makeTestBricks() {
        let startTestBrick = parseInt(this.canvasDom.height / 30)
        let testBrickX = parseInt(this.canvasDom.width / 2 - this.brickWidth * 2.5/2)
        

        if (!this.bricksDrawn) {

            for(let i=0; i<1; i++) {
                this.bricks.push(new Brick(testBrickX, startTestBrick + i * parseInt(1.25 * this.brickHeight), parseInt(this.brickWidth * 2.5), this.brickHeight))
            } 
        
            this.bricksDrawn = true

        } else {

            this.remainingBricks = 0

            for (let brick of this.bricks) {
                if (!brick.hit) {
                    brick.display(this.ctx)
                    this.remainingBricks++
                }
            }

            localStorage.setItem('Remaining bricks', this.remainingBricks)

        }
               
    }
    
    makeBricks() {

        let bricksPerRow = Math.min(this.qtyBricks, parseInt(this.canvasDom.width / this.brickWidth))
        let nbRows = Math.ceil(this.qtyBricks / bricksPerRow)
        let totalRowFreeSpace = parseInt(this.canvasDom.width - bricksPerRow * this.brickWidth)
        let brickMargin = parseInt(totalRowFreeSpace / (bricksPerRow + 1))
        let oddBricksOnLastRow = this.qtyBricks % bricksPerRow
        let brickX, brickY

        while (brickMargin < this.minColumnMargin) {
            // console.log(`Adjusting brick margin`)
            bricksPerRow--
            nbRows = Math.ceil(this.qtyBricks / bricksPerRow)
            totalRowFreeSpace = parseInt(this.canvasDom.width - bricksPerRow * this.brickWidth)
            brickMargin = parseInt(totalRowFreeSpace / (bricksPerRow + 1))
            oddBricksOnLastRow = this.qtyBricks % bricksPerRow
        }

        if (!this.bricksDrawn) {

            if (oddBricksOnLastRow === 0) {

                for(let j=0; j<nbRows; j++) {
                    for (let i=0; i<bricksPerRow; i++) {
                        
                        brickX = brickMargin + i * (this.brickWidth + brickMargin)
                        brickY = this.rowMargin + j*this.brickHeight + j*this.rowMargin
                        this.bricks.push(new Brick(brickX, brickY, this.brickWidth, this.brickHeight))
                    
                    }
                }

            } else {

                for(let j=0; j<nbRows-1; j++) {
                    for (let i=0; i<bricksPerRow; i++) {
                        
                        brickX = brickMargin + i * (this.brickWidth + brickMargin)
                        brickY = this.rowMargin + j*this.brickHeight + j*this.rowMargin
                        this.bricks.push(new Brick(brickX, brickY, this.brickWidth, this.brickHeight))
                    
                    }
                }

                let lastRowEdgeMargin = parseInt(.5 * (this.canvasDom.width - oddBricksOnLastRow * this.brickWidth - brickMargin * (oddBricksOnLastRow - 1)) )

                for (let i=0; i<oddBricksOnLastRow; i++) {

                    let j = nbRows-1
                    brickX = lastRowEdgeMargin + i * (this.brickWidth + brickMargin)
                    brickY = this.rowMargin + j*this.brickHeight + j*this.rowMargin
                    this.bricks.push(new Brick(brickX, brickY, this.brickWidth, this.brickHeight))
                
                }

            }

            this.bricksDrawn = true

        } else {

            this.remainingBricks = 0

            for (let brick of this.bricks) {
                if (!brick.hit) {
                    brick.display(this.ctx)
                    this.remainingBricks++
                }
            }

            localStorage.setItem('Remaining bricks', this.remainingBricks)

        }
    }

    play() {

        cancelAnimationFrame(this.animationInit)

        if (this.start) this.ball.move()

        this.detectCollisions()

        this.display()

        if (this.remainingBricks === 0) {
            console.log('%%% Game completed %%%');
            this.ctx.font = '40px Arial'
            this.ctx.textAlign = 'center'
            this.ctx.fillText("Well done!", this.canvasDom.width/2, this.canvasDom.height/2)
            
            if (!this.gameCompleted) {
                this.games.push([parseFloat(Date.now()/1000).toFixed(0), this.timeElapsed])
                localStorage.setItem('Games', JSON.stringify(this.games))
            }
            
            this.gameCompleted = true    

        }
        
        if (!this.gameOver && !this.pause) {
            this.animationId = requestAnimationFrame(this.play.bind(this))
        }

    }

    display() {

        if (this.gameOver) {
            console.log('Game over')
            this.ctx.font = '40px Arial'
            this.ctx.textAlign = 'center'
            this.ctx.fillText("Game over", this.canvasDom.width/2, this.canvasDom.height * .8)

            console.log(parseFloat(Date.now()/1000).toFixed(0));

            return
        }

        this.ctx.clearRect(0, 0, this.canvasDom.width, this.canvasDom.height)

        this.ctx.fillStyle = this.background

        this.ctx.fillRect(0, 0, this.canvasDom.width, this.canvasDom.height)

        this.ctx.fillStyle = this.ball.color
        
        this.ball.display(this.ctx)

        if (!this.gameCompleted) this.timeElapsed = parseFloat((Date.now() - this.timeStart)/1000,2).toFixed(2)

        this.ctx.font = this.canvasDom.height/40 + 'px Arial'
        this.ctx.fillText(this.timeElapsed, this.canvasDom.width * .05, this.canvasDom.height*.94)

        if(this.remainingBricks === 0) this.ball.color = '#3CB043'

        if (this.remainingBricks > 0) this.paddle.display(this.ctx)

        if(this.testMode) {
            this.makeTestBricks()
        } else {
            this.makeBricks()
        }
    }

    detectCollisions(){

        let ballLowerEdge = this.ball.y + this.ball.radius
        let ballUpperEdge = this.ball.y - this.ball.radius
        let ballLeftEdge = this.ball.x - this.ball.radius
        let ballRightEdge = this.ball.x + this.ball.radius

        let paddleLeftEdge = this.paddle.x
        let paddleRightEdge = this.paddle.x + this.paddle.width
        let paddleUpperEdge = this.paddle.y
    
        // Ball bounce from ceiling
        if (ballUpperEdge <= 0) {
            this.ball.y = this.ball.radius
            this.ball.dirY*=-1
        }

        //Ball falls below canvas
        if (ballUpperEdge >= this.canvasDom.height && this.remainingBricks > 0) {
            this.gameOver = true
        }
        
        if (ballLowerEdge >= this.canvasDom.height && this.remainingBricks === 0) {
            this.ball.y = this.canvasDom.height - this.ball.radius
            this.ball.dirY =-1
        }

        // Ball bounce from paddle
        if (ballRightEdge >= paddleLeftEdge && ballLeftEdge <= paddleRightEdge && this.remainingBricks > 0) {
            if (ballLowerEdge >= paddleUpperEdge) this.ball.dirY *= -1
        }

        // Ball bounce from left wall
        if (ballLeftEdge <= 0 ) {
            this.ball.x = this.ball.radius
            this.ball.dirX *= -1
        }

        // Ball bounce from right wall
        if (ballRightEdge >= this.canvasDom.width) {
            this.ball.x = this.canvasDom.width - this.ball.radius
            this.ball.dirX *= -1
        }

        // BRICK COLLISIONS
        for(let i=0; i<this.bricks.length; i++) {

            let brickLowerEdge = this.bricks[i].y + this.bricks[i].height
            let brickUpperEdge = this.bricks[i].y
            let brickLeftEdge = this.bricks[i].x
            let brickRightEdge = this.bricks[i].x + this.bricks[i].width
            if(this.bricks[i].hit) continue

            if(this.testMode) {
                console.log(`Ball: U${ballUpperEdge} D${ballLowerEdge} L${ballLeftEdge} R${ballRightEdge}`);
                console.log(`Brick: U${brickUpperEdge} D${brickLowerEdge} L${brickLeftEdge} R${brickRightEdge}`);
            }

            // LOWER EDGE COLLISION : ballUpperEdge <= brickLowerEdge
            if(
                ballRightEdge >= brickLeftEdge
            &&  ballLeftEdge <= brickRightEdge
            &&  ballLowerEdge >= brickLowerEdge
            &&  ballUpperEdge <= brickLowerEdge
            &&  this.ball.dirY === -1
            ) {
                console.log(`<>-- Hit lower edge of brick ${i+1} --<>`)
                this.bricks[i].hit = true
                this.ball.dirY *= -1
                this.ball.y += 2
                localStorage.setItem('hey', 'ho')
                break
            }

            // UPPER EDGE COLLISION : ballLowerEdge >= brickUpperEdge
            if(
                ballRightEdge >= brickLeftEdge
            &&  ballLeftEdge <= brickRightEdge
            &&  ballUpperEdge <= brickUpperEdge
            &&  ballLowerEdge >= brickUpperEdge
            &&  this.ball.dirY === 1
            ) {
                console.log(`<>-- Hit upper edge of brick ${i+1} --<>`)
                this.bricks[i].hit = true
                this.ball.dirY *= -1
                this.ball.y -= 2
                break
            }

            // RIGHT EDGE COLLISION : ballLeftEdge <= brickRightEdge
            if(
                ballUpperEdge <= brickLowerEdge
            &&  ballLowerEdge >= brickUpperEdge
            &&  ballRightEdge >= brickRightEdge
            &&  ballLeftEdge <= brickRightEdge
            &&  this.ball.dirX === -1
            ) {
                console.log(`<>-- Hit right edge of brick ${i+1} --<>`)
                this.bricks[i].hit = true
                this.ball.dirX *= -1
                this.ball.x +=2
                break
            }

            // LEFT EDGE COLLISION : ballRightEdge >= brickLeftEdge
            if(
                ballUpperEdge <= brickLowerEdge
            &&  ballLowerEdge >= brickUpperEdge
            &&  ballLeftEdge <= brickLeftEdge
            &&  ballRightEdge >= brickLeftEdge
            &&  this.ball.dirX === 1
            ) {
                console.log(`<>-- Hit left edge of brick ${i+1} --<>`)
                this.bricks[i].hit = true
                this.ball.dirX *= -1
                this.ball.x -=2
                break
            }        
        }

    // Storing brick status in local storage
    // for (let i=0; i<this.bricks.length; i++) {
    //     localStorage.setItem('Brick ' + i, this.bricks[i].hit)
    // }

    }

    /** Fonction qui affiche le gameOver */
    // displayGameOver()
    // {
    //     this.ctx.fillStyle = 'black';
    //     // On définie la police de caractère
    //     this.ctx.font = 'bold 30px Verdana';

    //     //On mesure la largeur du texte
    //     let txtMetrics = this.ctx.measureText('Game Over');

    //     // On ecrit Game Over
    //     this.ctx.fillText('Game Over.', this.width / 2 - txtMetrics.width/2, this.height/2);
    // }

}

export default Game