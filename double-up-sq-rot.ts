const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const sizeFactor : number = 4.9 
const delay : number = 20
const backColor : string = "#BDBDBD"
const rot : number = Math.PI 
const w : number = window.innerWidth 
const h : number = window.innerHeight 

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawXY(context : CanvasRenderingContext2D, x : number, y : number, cb : () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawDoubleUpSqRot(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor
        const dsc : (a : number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2) * dsc(3), () => {
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, 0, -h * 0.5 * (1 - dsc(j)), () => {
                    context.scale(1, 1  - 2 * j)
                    context.rotate(rot * dsc(2))
                    context.fillRect(0, -size, size, size)
                })
            }
        })
    }

    static drawDUSRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawDoubleUpSqRot(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D | null 

    initCanvas() {

    }

    render() {
        if (this.context) {
            this.context.fillStyle = backColor 
            this.context.fillRect(0, 0, w, h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale : number = 0 
    dir : number = 0
    prevScale : number = 0

    update(cb : () => void) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : () => void) {
        if (this.dir === 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : () => void) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}

class DUSRNode {

    prev : DUSRNode 
    next : DUSRNode 
    state : State = new State()

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new DUSRNode(this.i + 1)
            this.next.prev = this 
        }
    }

    constructor(private i : number) {
        this.addNeighbor()
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawDUSRNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : DUSRNode {
        var curr : DUSRNode = this.next 
        if (dir == -1) {
            curr = this.prev 
        }
        if (curr) {
            return curr 
        }
        cb()
        return this 
    }
}