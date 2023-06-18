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
const sizeFactor : number = 4.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const rot : number = Math.PI / 4

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
    
    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            return 
        }
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawBarRightDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2, () => {
            context.fillRect(0, - size / 2, size * dsc(0), size)
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, -w / 2 + (w / 2) * dsc(1), 0, () => {
                    context.rotate(rot * dsc(2) * (1 -  2 * j))
                    DrawingUtil.drawLine(context, 0, 0, -size, 0)
                })
            }
        })
    }

    static drawBRDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawBarRightDown(context, scale)
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

class BRDNode {

    prev : BRDNode 
    next : BRDNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor(){
        this.next = new BRDNode(this.i + 1)
        this.next.prev = this 
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawBRDNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    } 

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : BRDNode {
        var curr : BRDNode = this.prev 
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

class BarRightDown {

    curr : BRDNode = new BRDNode(0)
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

    brd : BarRightDown = new BarRightDown()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.brd.draw(context)
    }

    handleTap(cb : () => void) {
        this.brd.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.brd.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}