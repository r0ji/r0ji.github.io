class Brick {

    constructor(x, y, width, height) {
        this.color = "#555";
        this._x = x
        this._y = y
        this.width = width
        this.height = height
        this.hit = false
    }

    display(ctx) {
        // console.log(`Displaying brick - x:${this.x} y:${this.y}`);
        ctx.fillStyle = this.color
        ctx.fillRect(this.x, this.y, this.width, this.height)
    }

    get x(){
        return this._x
    }

    set x(x){
        this._x = x
    }

    get y(){
        return this._y
    }

    set y(y){
        this._y = y
    }

}

export default Brick