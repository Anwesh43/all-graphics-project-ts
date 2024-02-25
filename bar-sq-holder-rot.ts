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
const rot : number = Math.PI / 2
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

    static drawBarSqHolderRot(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2 + (w / 2 + size / 2) * dsc(3), h / 2, () => {
            DrawingUtil.drawXY(context, 0, -h * 0.5 * (1 - dsc(0)) , () => {
                context.rotate(rot * dsc(1))
                context.fillRect(-size / 2, -size / 4, size, size / 4)
            })
            DrawingUtil.drawXY(context, 0, -h * 0.5 * (1 - dsc(2)), () => {
                context.fillRect(-size / 8, -size / 4, size / 4, size / 4)
            })
        })
    }

    static drawBSHRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBarSqHolderRot(context, scale)
    }
}