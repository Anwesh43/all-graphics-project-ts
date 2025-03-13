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
const sizeFactor: number = 4.9
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

    static drawLine(context: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number) {
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            context.beginPath()
            context.moveTo(x1, y1)
            context.lineTo(x2, y2)
            context.stroke()
        }
    }

    static drawTriStepLineRot(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (a: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2 + (w / 2) * dsc(4), h / 2, () => {
            context.rotate(rot * dsc(3))
            for (let j = 0; j < 3; j++) {
                DrawingUtil.drawXY(context, size * 0.5 * j, 0, () => {
                    DrawingUtil.drawLine(context, 0, 0, 0, -(size * 0.5 + size * 0.25 * j) * dsc(j))
                })
            }
        })
    }

    static drawTSLRNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.lineCap = 'round'
        context.strokeStyle = colors[i]
        context.lineWidth = Math.min(w, h) / strokeFactor
        DrawingUtil.drawTriStepLineRot(context, scale)
    }
}