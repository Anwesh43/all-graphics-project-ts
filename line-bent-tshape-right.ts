const colors: Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts: number = 4
const scGap: number = 0.04 / parts
const strokeFactor: number = 90
const sizeFactor: number = 5.9
const delay: number = 20
const backColor: string = "#BDBDBD"
const rot1: number = Math.PI / 4
const rot2: number = Math.PI / 2 + rot1
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

    static drawLineBentTShapeRight(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.PI / sizeFactor
        const dsc: (a: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2 + (w / 2) * dsc(3), h / 2, () => {
            DrawingUtil.drawLine(context, 0, 0, size * dsc(0), 0)
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, size, 0, () => {
                    context.rotate(rot1 * (j + (1 - j) * (1 - dsc(2))) + rot2 * j * dsc(2))
                    DrawingUtil.drawLine(context, 0, 0, 0, -size * dsc(1))
                })
            }
        })
    }

    static drawLBTSRNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        console.log("SCALE", scale)
        DrawingUtil.drawLineBentTShapeRight(context, scale)
    }
}

class Stage {

    canvas: HTMLCanvasElement = document.createElement('canvas')
    context: CanvasRenderingContext2D | null
    renderer: Renderer = new Renderer()

    initCanvas() {
        this.context = this.canvas.getContext('2d')
        this.canvas.width = w
        this.canvas.height = h
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
        this.scale += this.dir * scGap
        console.log("THIS.SCALE", this.scale)
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
    interval: number

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

class LBTSRNode {

    prev: LBTSRNode
    next: LBTSRNode
    state: State = new State()

    constructor(private i: number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new LBTSRNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context: CanvasRenderingContext2D) {
        DrawingUtil.drawLBTSRNode(context, this.i, this.state.scale)
    }

    update(cb: () => void) {
        this.state.update(cb)
    }

    startUpdating(cb: () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir: number, cb: () => void): LBTSRNode {
        var curr: LBTSRNode = this.prev
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

class LineBentTShapeRight {

    curr: LBTSRNode = new LBTSRNode(0)
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

    lbtsr: LineBentTShapeRight = new LineBentTShapeRight()
    animator: Animator = new Animator()

    render(context: CanvasRenderingContext2D) {
        this.lbtsr.draw(context)
    }

    handleTap(cb: () => void) {
        this.lbtsr.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.lbtsr.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}