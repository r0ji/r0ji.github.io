class Paddle {

    constructor(canvasDom, easyMode, speedMode) {
        this.color = '#777'
        this.width = parseInt(canvasDom.width / 5)
        if(easyMode) this.width = canvasDom.width
        this.height = parseInt(canvasDom.height / 25)
        this.speed = parseInt(canvasDom.width / 20)
        if(speedMode) this.speed *= 2
        this.x = parseInt(canvasDom.width / 2 - this.width / 2)
        this.y = parseInt(canvasDom.height * 0.95)
    }

    move(direction, maxWidth) {
        this.x += direction * this.speed

        if (this.x < 0) {
            this.x = 0
        }

        if (this.x + this.width > maxWidth) {
            this.x = maxWidth - this.width
        }
    }

    display(ctx) {

        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)

    }

    get x()  { return this._x }

    set x(x) { this._x = x }

    get y()  { return this._y }

    set y(y) { this._y = y }

    get direction() { return this._direction }

    set direction(direction) { this._direction = direction }

}

export default Paddle