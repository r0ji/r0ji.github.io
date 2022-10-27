class Ball {

    constructor(canvasDom, testMode, speedMode) {
        this.color = '#FF0000'
        this.radius = parseInt(canvasDom.height / 60)
        this.speed = parseInt(canvasDom.height / 150)
        if(testMode) this.speed *= 0.5
        if(speedMode) this.speed *= 2
        this.x = parseInt(canvasDom.width / 2)
        this.y = parseInt(canvasDom.height * 0.8)
        this.dirX = 1
        this.dirY = -1
    }

    move(){
        this.x += this.speed * this.dirX
        this.y += this.speed * this.dirY
    }

    move1(maxHeight, maxWidth, paddleX, paddleY, paddleWidth) {

        if (this.y - this.radius <= 0) {
            this.dirY *= -1
        }

        if (this.x >= paddleX && this.x <= paddleX + paddleWidth) {

            if (this.y + this.radius >= paddleY) {
                this.dirY *= -1
            }
            
        }

        if (this.y - this.radius >= maxHeight) {
            return true
        }

        this.y += this.speed * this.dirY

        if (this.x - this.radius <= 0 || this.x + this.radius >= maxWidth) {
            this.dirX *= -1
        }

        this.x += this.speed * this.dirX

        return false

    }

    display(ctx) {

        ctx.beginPath()

        ctx.arc(this.x, this.y, this.radius, 0, 2*Math.PI)

        ctx.fill()

    } 

    get x()  { return this._x }

    set x(x) { this._x = x }

    get y()  { return this._y }

    set y(y) { this._y = y }

    get dirY() { return this._dirY }

    set dirY(dirY) { this._dirY = dirY}

}

export default Ball