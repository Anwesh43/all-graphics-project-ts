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
const rot: number = Math.PI / 2
const backColor: string = "#BDBDBD"
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

    static drawLineRotRight(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (a: number) => number = (i: number) => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, size + (w / 2 - size) * dsc(2) + w * 0.5 * dsc(4), h / 2, () => {
            context.rotate(rot * (dsc(1) + dsc(3)))
            DrawingUtil.drawLine(context, -size, 0, -size + size * dsc(0), 0)
        })
    }

    static drawLRRNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        DrawingUtil.drawLineRotRight(context, scale)
    }
}