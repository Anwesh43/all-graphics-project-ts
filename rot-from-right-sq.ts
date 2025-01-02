const colors: Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts: number = 4
const scGap: number = 0.04 / parts
const delay: number = 20
const backColor: string = "#BDBDBD"
const rot: number = -Math.PI
const sizeFactor: number = 5.2
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

    static drawRotFromRightSq(context: CanvasRenderingContext2D, scale: number) {
        const size: number = Math.min(w, h) / sizeFactor
        const dsc: (a: number) => number = (i: number) => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w - (w / 2) * (dsc(0) + dsc(3)), h / 2 + (h / 2 - size / 2) * dsc(2), () => {
            context.rotate(rot * dsc(1))
            context.fillRect(0, -size / 2, size, size)
        })
    }

    static drawRFRSNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawRotFromRightSq(context, scale)
    }
}