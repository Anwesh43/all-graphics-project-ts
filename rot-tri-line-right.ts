const colors: Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts: number = 5
const scGap: number = 0.04 / parts
const strokeFactor: number = 90
const sizeFactor: number = 5.9
const delay: number = 20
const backColor: string = "#BDBDBD"
const rot: number = -Math.PI
const w: number = window.innerWidth
const h: number = window.innerHeight

class ScaleUtil {

    static maxScale(scale: number, i: number, n: number): number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale: number, i: number, n: number): number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n
    }
}

class PathLine {

    constructor(private x: number, private y: number, private x1: number, private y1: number) {

    }
    draw(context: CanvasRenderingContext2D, rot: number, size: number) {
        const x: number = size * this.x, y: number = size * this.y, x1 = size * this.x1, y1 = size * this.y1
        DrawingUtil.drawXY(context, x, y, () => {
            context.rotate(rot)
            DrawingUtil.drawLine(context, 0, 0, x1, y1)
        })
    }
}

const pathLines: PathLine[] = [new PathLine(0, 0, 0, -1), new PathLine(0, -1, 1, 1), new PathLine(1, 0, -1, 1)]

class DrawingUtil {

    static drawXY(context: CanvasRenderingContext2D, x: number, y: number, cb: () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            return
        }
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawRotTriLineRight(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (i: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2, () => {
            pathLines.forEach((pathLine: PathLine, j: number) => {
                const currRot: number = j == 0 ? rot * dsc(3) : 0
                pathLine.draw(context, currRot, size * dsc(j))
            })
        })
    }

    static drawRTLRNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        DrawingUtil.drawRotTriLineRight(context, scale)
    }
}

class Stage {

    canvas: HTMLCanvasElement = document.createElement('canvas')
    context: CanvasRenderingContext2D | null = null

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
        const stage: Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}

class State {

    scale: number = 0
    dir: number = 0
    prevScale: number = 0

    update(cb: () => void) {
        this.scale += scGap * this.dir
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir
            this.dir = 0
            this.prevScale = this.scale
            cb()
        }
    }

    startUpdating(cb: () => void) {
        if (this.dir === 0) {
            this.dir = 1 - 2 * this.prevScale
            cb()
        }
    }
}

class Animator {

    animated: boolean = false
    interval: number = 0

    start(cb: () => void) {
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

class RTLRNode {

    prev: RTLRNode | null = null
    next: RTLRNode | null = null
    state: State = new State()

    constructor(private i: number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new RTLRNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context: CanvasRenderingContext2D) {

    }

    update(cb: () => void) {
        this.state.update(cb)
    }

    startUpdating(cb: () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir: number, cb: () => void): RTLRNode {
        var curr: RTLRNode | null = this.prev
        if (dir === 1) {
            curr = this.next
        }
        if (curr) {
            return curr
        }
        cb()
        return this
    }
}

class RotTriLineRight {

    curr: RTLRNode = new RTLRNode(0)
    dir: number = 1

    draw(context: CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb: () => void) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb: () => void) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {

    rtlr: RotTriLineRight = new RotTriLineRight()
    animator: Animator = new Animator()

    render(context: CanvasRenderingContext2D) {
        this.rtlr.draw(context)
    }

    handleTap(cb: () => void) {
        this.rtlr.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.rtlr.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}