const colors : Array<string> = [
    "#B71C1C",
    "#00C853",
    "#0091EA",
    "#AA00FF",
    "#FFAB00"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 2 
const strokeFactor : number = 90 
const sizeFactor : number = 4.9 
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

    static drawBarDivideSeparate(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        DrawingUtil.drawXY(context, w * 0.5 * dsc(1), size / 2 + (h / 2 - size / 2) * dsc(1) , () => {
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, 0, 0, () => {
                    context.scale(1, 1 - 2 * j)
                    context.rotate(rot * dsc(2))
                    context.fillRect(0, h * 0.5 * dsc(3), size * dsc(0), size / 2)
                })
            }
            
        })
    }

    static drawBDSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBarDivideSeparate(context, scale)
    }
}