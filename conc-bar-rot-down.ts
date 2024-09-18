const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 4
const scGap : number = 0.04 / parts
const strokeFactor : number = 90
const sizeFactor : number = 4.9 
const delay : number = 20
const backColor : string = "#BDBDBD"
const rot : number = Math.PI 
const w : number = window.innerWidth 
const h : number = window.innerHeight 

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawXY(context : CanvasRenderingContext2D, x : number, y : number, cb : () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawConcBar(context : CanvasRenderingContext2D, size : number, dsc : number[]) {
        const barH : number = size / 4
        for (let j = 0; j < 2; j++) {
            DrawingUtil.drawXY(context, 0, -barH * j, () => {
                const dsj : number = dsc[j]
                context.fillRect(-size * 0.5 * dsj, -barH, size * dsj, barH)
            })
        }
    }

    static drawConcBarRotDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (i : number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2) * dsc(3), () => {
            context.rotate(rot * dsc(2))
            DrawingUtil.drawConcBar(context, size, [dsc(0), dsc(1)])
        })
    }

    static drawCBRDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawConcBarRotDown(context, scale)
    }
}