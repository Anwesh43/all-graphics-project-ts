const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 5
const scGap : number = 0.03 / parts 
const sizeFactor : number = 3.9 
const rFactor : number = 28.2 
const delay : number = 22
const backColor : string = "#BDBDBD"
const strokeFactor : number = 90 
const rot : number = Math.PI / 2
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

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawSquareSideArcShift(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor
        const r : number = Math.min(w, h) / rFactor  
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale,i , parts)
       
        context.save()
        context.translate(w / 2, h / 2 - (h / 2 + size) * dsc(4))
        context.rotate(-rot * dsc(2))
        context.fillRect(-size, -size / 2, size * dsc(0), size)
        for (let j = 0; j < 2; j++) {
            DrawingUtil.drawCircle(context, r, -h / 2  -r + (h / 2 + size / 2) * dsc(0) - (size - 2 * r) * dsc(3) * j, r)
        }
        context.restore()
    }

    static drawSSASNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i] 
        console.log("SCALE", scale, colors[i])
        DrawingUtil.drawSquareSideArcShift(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D | null 
    renderer : Renderer = new Renderer()

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        if (this.context) {
            this.context.fillStyle = backColor 
            this.context.fillRect(0, 0, w, h)
            this.renderer.render(this.context)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
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
        if (this.dir == 0) {
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

class SSASNode {

    prev : SSASNode
    next : SSASNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new SSASNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawSSASNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : SSASNode {
        var curr : SSASNode = this.prev 
        if (dir == 1) {
            curr = this.next 
        }
        if (curr) {
            return curr 
        }
        cb()
        return this 
    }
}

class SquareSideArcShift {

    curr : SSASNode = new SSASNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }
    
    update(cb : () => void) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : () => void) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {

    ssas : SquareSideArcShift = new SquareSideArcShift()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.ssas.draw(context)
    }

    handleTap(cb : () => void) {
        this.ssas.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.ssas.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}