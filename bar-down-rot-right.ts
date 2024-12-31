const colors: Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts: number = 4
const scGap: number = 0.04 / parts
const barHFactor: number = 5.9
const barWFactor: number = 14.2
const rot: number = Math.PI / 2
const delay: number = 20
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

    static drawBarDownRotRight(context: CanvasRenderingContext2D, scale: number) {
        const barW: number = Math.min(w, h) / barWFactor
        const barH: number = Math.min(w, h) / barHFactor
        const dsc: (a: number) => number = (i: number): number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2 + (w / 2) * dsc(3), (h / 2) * dsc(2), () => {
            context.rotate(rot * dsc(1))
            context.fillRect(-barW, 0, barW, barH * dsc(0))
        })
    }

    static drawBDRRNode(context: CanvasRenderingContext2D, i: number, scale: number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBarDownRotRight(context, scale)
    }
}