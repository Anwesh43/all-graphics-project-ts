const colors: Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts: number = 4
const strokeFactor: number = 90
const sizeFactor: number = 4.9
const delay: number = 20
const backColor: string = "#BDBDBD"
const rot: number = Math.PI
const scGap: number = 0.04 / parts
const w: number = window.innerWidth
const h: number = window.innerHeight
const deg: number = Math.PI / 2

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

    static drawMultiRotSqDown(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (a: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2) * dsc(3), () => {
            context.rotate(rot * dsc(2))
            DrawingUtil.drawXY(context, w * 0.5 * (1 - dsc(0)), -size, () => {
                context.rotate(deg * dsc(1))
                context.fillRect(0, -size, size, size)
            })
        })
    }

    static drawMRSDNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawMultiRotSqDown(context, scale)
    }
}

class Stage {

    canvas: HTMLCanvasElement = document.createElement('canvas')
    context: CanvasRenderingContext2D | null
    renderer: Renderer = new Renderer()

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

class MRSDNode {

    prev: MRSDNode
    next: MRSDNode
    state: State = new State()

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new MRSDNode(this.i + 1)
            this.next.prev = this
        }
    }

    constructor(private i: number) {
        this.addNeighbor()
    }

    draw(context: CanvasRenderingContext2D) {
        DrawingUtil.drawMRSDNode(context, this.i, this.state.scale)
    }

    update(cb: () => void) {
        this.state.update(cb)
    }

    startUpdating(cb: () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir: number, cb: () => void): MRSDNode {
        var curr: MRSDNode = this.prev
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

class MultiRotSqDown {

    curr: MRSDNode = new MRSDNode(0)
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

    mrsd: MultiRotSqDown = new MultiRotSqDown()
    animator: Animator = new Animator()

    render(context: CanvasRenderingContext2D) {
        this.mrsd.draw(context)
    }

    handleTap(cb: () => void) {
        this.mrsd.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.mrsd.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}