const colors: Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts: number = 4
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

    static drawSqDownRotLeft(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (a: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, (w / 2), (h / 2) * (dsc(1) - dsc(3)), () => {
            context.rotate(rot * dsc(2))
            context.fillRect(0, 0, size * dsc(0), size)
        })
    }

    static drawSDRLNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawSqDownRotLeft(context, scale)
    }
}

class Stage {

    canvas: HTMLCanvasElement = document.createElement('canvas')
    context: CanvasRenderingContext2D | null

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