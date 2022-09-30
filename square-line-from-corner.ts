const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 6.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
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

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawSquareLineFromCorner(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2 - (h / 2 + size) * dsc(3))
        context.rotate(rot * dsc(2))
        context.fillRect(-size * 0.5 * dsc(0), size * 0.5 * dsc(0), size * dsc(0), size * dsc(0))
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1, 1 - 2 * j)
            context.translate(size / 2, -size / 2)
            DrawingUtil.drawLine(context, 0, 0, size * 0.5 * dsc(1), -size * 0.5 * dsc(1))
            context.restore()
        }
        DrawingUtil.drawLine(context, -size / 2, 0, -size / 2 - size * 0.5 * dsc(1), 0)
        context.restore()
    }

    static drawSLFCNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.lineCap = 'round'
        context.fillStyle = colors[i]
        context.strokeStyle = colors[i]
        DrawingUtil.drawSquareLineFromCorner(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D | null 

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

class SLFCNode {

    prev : SLFCNode 
    next : SLFCNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length  - 1) {
            this.next = new SLFCNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawSLFCNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : SLFCNode {
        var curr : SLFCNode = this.prev 
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

class SquareLineFromCorner {

    curr : SLFCNode = new SLFCNode(0)
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

    slfc : SquareLineFromCorner = new SquareLineFromCorner()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.slfc.draw(context)
    }

    handleTap(cb : () => void) {
        this.slfc.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.slfc.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}