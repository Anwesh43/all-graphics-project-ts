const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"   
]
const parts : number = 4
const scGap : number = 0.04 / parts 
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

    static drawThreeSquareRight(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (a : number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2 + (w / 2 + 1.5 * size) * dsc(3), h / 2, () => {
            context.rotate(rot * dsc(2))
            for (let i = 0; i < 3; i++) {
                DrawingUtil.drawXY(context, (-w / 2 - size / 2) * (1 - dsc(0)), (h / 2 - size / 2) * (1 - dsc(1)) * i, () => {
                    context.fillRect(-size / 2, -size / 2, size, size)
                })
            }
        })
    }

    static drawTSRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawThreeSquareRight(context, scale)
    }
}