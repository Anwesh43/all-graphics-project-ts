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
const sizeFactor: number = 4.9
const delay: number = 20
const backColor: string = "#BDBDBD"
const rot: number = 45
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

    static drawArc(context: CanvasRenderingContext2D, r: number, start: number, sweep: number) {
        const startInt: number = Math.floor(start)
        const sweepInt: number = Math.floor(sweep)
        context.beginPath()
        for (let i = startInt; i <= sweepInt; i++) {
            const x: number = r * Math.cos(i * Math.PI / 180)
            const y: number = r * Math.sin(i * Math.PI / 180)
            if (i === startInt) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
    }

    static drawArcQuarterPartial(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (a: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2 + size / 2) * dsc(3), () => {
            context.rotate(deg * dsc(1))
            for (let j = 0; j < 4; j++) {
                DrawingUtil.drawXY(context, 0, 0, () => {
                    context.rotate(rot * 2 * j)
                    DrawingUtil.drawArc(context, size * 0.5, -rot * 0.5 * (dsc(0) + dsc(2)), rot * (dsc(0) + dsc(2)))
                })
            }
        })
    }

    static drawAQPNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        DrawingUtil.drawArcQuarterPartial(context, scale)
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