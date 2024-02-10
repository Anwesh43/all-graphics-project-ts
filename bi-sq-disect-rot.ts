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
const rot : number = Math.PI / 2
const backColor : string = "#BDBDBD"
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

    static drawSqDisectRot(context : CanvasRenderingContext2D, x : number,  wBar : number, hBar : number, rot : number) {
        DrawingUtil.drawXY(context, x, 0, () => {
            context.rotate(rot)
            context.fillRect(0, 0, wBar, hBar)
        })
    }

    static drawBiSqDisectRot(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (i : number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2) * dsc(3), () => {
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, 0, 0, () => {
                    context.scale(1 - 2 * j, 1)
                    DrawingUtil.drawSqDisectRot(context, -size, size * dsc(0), size / 2 , rot * dsc(1 + j))
                })
            }
        }) 
    }

    static drawBSDRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBiSqDisectRot(context, scale)
    }
}