const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 5
const scGap : number = 0.04 / parts 
const delay : number = 20 
const sizeFactor : number = 4.9 
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

    static drawSingleSqToBigSq(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2 + size) * dsc(4), () => {
            context.rotate(rot * dsc(4))
            for (let j = 0; j < 4; j++) {
                DrawingUtil.drawXY(context, 0, 0, () => {
                    const factor : number = j == 0 ? 1 : Math.floor(dsc(j - 1))
                    context.rotate(rot * (factor - 1) + rot * dsc(j))
                    context.fillRect(0, -size * dsc(0), size * dsc(0), size * dsc(0))
                })
            }
        })
    }

    static drawSSTBSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawSingleSqToBigSq(context, scale)
    }
}