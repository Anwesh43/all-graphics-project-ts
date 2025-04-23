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
const sizeFactor: number = 6.9
const delaay: number = 20
const backColor: string = "#BDBDBD"
const rot: number = Math.PI
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

    static drawHalfBoxRotComplete(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (i: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w * dsc(4), h / 2, () => {
            for (let j = 0; j < 3; j++) {
                const xi: number = Math.floor((j + 1) / 2)
                const xi1: number = Math.floor(j / 2)
                const yi: number = (j) % 2
                DrawingUtil.drawXY(context, size * xi, -size + size * xi1, () => {
                    context.rotate(rot * j * dsc(3))
                    DrawingUtil.drawLine(context, 0, 0, size * dsc(j) * (1 - yi), size * dsc(j) * yi)
                })
            }
        })
    }

    static drawHBRCNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        DrawingUtil.drawHalfBoxRotComplete(context, scale)
    }
}