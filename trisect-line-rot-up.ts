const colors: Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const lines: number = 3
const parts: number = lines + 2
const scGap: number = 0.04 / parts
const delay: number = 20
const backColor: string = "#BDBDBD"
const finalRot: number = 1.25 * Math.PI
const rot: number = Math.PI / 2
const trisectDeg: number = Math.PI / 4
const w: number = window.innerWidth
const h: number = window.innerHeight
const sizeFactor: number = 5.9
const strokeFactor: number = 90

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

    static drawTrisectLineRotUp(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (a: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        const dsk: (i: number, j: number) => number = (i: number, j: number): number => ScaleUtil.divideScale(dsc(i), j, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 - (h / 2) * dsc(4), () => {
            context.rotate(rot * dsc(3))
            for (let j = 0; j < lines; j++) {
                DrawingUtil.drawXY(context, 0, -h * 0.5 * (1 - dsk(j, 0)), () => {
                    context.rotate((finalRot - trisectDeg * j) * (1 - dsk(j, 1)))
                    DrawingUtil.drawLine(context, 0, 0, 0, -size)
                })
            }
        })
    }

    static drawTLRUNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        DrawingUtil.drawTrisectLineRotUp(context, scale)
    }
}