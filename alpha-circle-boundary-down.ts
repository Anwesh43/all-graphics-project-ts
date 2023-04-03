const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 2 * 4 - 1
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90
const sizeFactor : number = 4.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const alphaDec : number = 0.6

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

    static drawStrokeCircle(context : CanvasRenderingContext2D, cx : number, cy : number, r : number, deg : number) {
        context.beginPath()
        for (let j = 0; j <= deg; j++) {
            const x : number = cx + r * Math.cos(j * Math.PI / 180)
            const y : number = cy + r * Math.sin(j * Math.PI / 180)
            if (j == 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
    }

    static drawXY(context : CanvasRenderingContext2D, x : number, y : number, cb : () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawAlphaCircleBoundaryDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i * 2, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2 + size) * dsc(3), () => {
            DrawingUtil.drawXY(context, 0, 0, () => {
                context.globalAlpha = 1 - alphaDec * dsc(1)
                DrawingUtil.drawCircle(context, 0, 0, size * dsc(1))
            })
            DrawingUtil.drawXY(context, 0, 0, () => {
                context.globalAlpha = 1
                DrawingUtil.drawStrokeCircle(context, 0, 0, size, 360 * dsc(2))
            })
        })       
    }

    static drawACBDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawAlphaCircleBoundaryDown(context, scale)
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
        this.scale += this.dir * scGap
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

class ACBDNode {

    prev : ACBDNode 
    next : ACBDNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new ACBDNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawACBDNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : ACBDNode {
        var curr : ACBDNode = this.prev 
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

class AlphaCircleBoundaryDown {

    curr : ACBDNode = new ACBDNode(0)
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

    acbd : AlphaCircleBoundaryDown = new AlphaCircleBoundaryDown()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.acbd.draw(context)
    }

    handleTap(cb : () => void) {
        this.acbd.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.acbd.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}