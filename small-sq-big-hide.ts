const colors: Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts: number = 6
const scGap: number = 0.04 / parts
const sizeFactor: number = 6.9
const delay: number = 20
const backColor: string = "#BDBDBD"
const rot: number = Math.PI / 2
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

    static scaleXY(context: CanvasRenderingContext2D, scaleX: number, scaleY: number, cb: () => void) {
        DrawingUtil.drawXY(context, 0, 0, () => {
            context.scale(scaleX, scaleY)
            cb()
        })
    }

    static rotateOrigin(context: CanvasRenderingContext2D, rot: number, cb: () => void) {
        DrawingUtil.drawXY(context, 0, 0, () => {
            context.rotate(rot)
            cb()
        })
    }

    static drawSmallSqBigHide(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (a: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        const upSize: number = size * (1 - dsc(5))
        DrawingUtil.drawXY(context, w / 2, h / 2, () => {
            DrawingUtil.rotateOrigin(context, rot * dsc(4), () => {
                for (let j = 0; j < 2; j++) {
                    DrawingUtil.scaleXY(context, 1 - 2 * j, 1, () => {
                        for (let k = 0; k < 2; k++) {
                            DrawingUtil.drawXY(context, 1, 1 - 2 * k, () => {
                                DrawingUtil.drawXY(context, (w / 2) * (1 - dsc(2 * k + j)), 0, () => {
                                    context.fillRect(0, -upSize, upSize, upSize)
                                })
                            })
                        }
                    })
                }
            })
        })
    }

    static drawSSBHNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawSmallSqBigHide(context, scale)
    }
}

class Stage {

    canvas: HTMLCanvasElement = document.createElement('canvas')
    context: CanvasRenderingContext2D | null

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
    prevScale: number = 0
    dir: number = 0

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

class SSBHNode {

    prev: SSBHNode
    next: SSBHNode
    state: State = new State()

    constructor(private i: number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new SSBHNode(this.i + 1)
            this.next.prev = this
        }
    }

    draw(context: CanvasRenderingContext2D) {
        DrawingUtil.drawSSBHNode(context, this.i, this.state.scale)
    }

    update(cb: () => void) {
        this.state.update(cb)
    }

    startUpdating(cb: () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir: number, cb: () => void): SSBHNode {
        var curr: SSBHNode = this.prev
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

class SmallSqBigHide {

    curr: SSBHNode = new SSBHNode(0)
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