const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const sizeFactor : number = 4.9 
const barHFactor : number = 23.2 
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

    static drawBarRotBreakDown(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const barH : number = Math.min(w, h) / barHFactor 
        context.save()
        context.translate(w / 2, h / 2)
        for (let j = 0; j < 2; j++) {
            DrawingUtil.drawXY(context, 0, 0, () => {
                context.scale(1 - 2 * j, 1)
                DrawingUtil.drawXY(context, w * 0.5 * dsc(2), (h / 2 + size) * dsc(3), () => {
                    context.rotate(rot * dsc(1))
                    context.fillRect(-size * 0.5 * dsc(0), -barH, size * dsc(0), barH)
                })
            })
        }       
        context.restore()
    }

    static drawBRBDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBarRotBreakDown(context, scale)
    }
}