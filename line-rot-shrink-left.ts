const colors : Array<string> = [
    "#B71C1C",
    "#00C853",
    "#0091EA",
    "#AA00FF",
    "#FFAB00"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const rot : number = Math.PI / 2
const delay : number = 20 
const backColor : string = "#BDBDBD"
const sizeFactor : number = 4.9 
const strokeFactor : number = 90 
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

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawLineRotShrinkLeft(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w * 0.5 * (dsc(0) - dsc(3)), h / 2, () => {
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, 0, 0, () => {
                    context.rotate(-rot * j * dsc(1))
                    DrawingUtil.drawLine(context, 0, 0, -size + size * 0.5 * j * dsc(2), 0)
                })
            }
        })
    }

    static drawLRSLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawLineRotShrinkLeft(context, scale)
    }
}