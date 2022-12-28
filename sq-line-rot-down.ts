const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
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

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            return 
        }
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawXY(context : CanvasRenderingContext2D, x : number, y : number, cb : () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawSqLineRotDown(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (i : number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        DrawingUtil.drawXY(context, w / 2, h / 2 - (h / 2 + size) * dsc(3), () => {
            context.rotate(rot * dsc(2))
            DrawingUtil.drawXY(context, -w / 2 + (w / 2) * dsc(1), 0, () => {
                DrawingUtil.drawLine(context, 0, 0, -size, 0)
            })
            DrawingUtil.drawXY(context, 0, -(h /2 + size / 10) * (1 - dsc(0)), () => {
                context.fillRect(-size / 10, -size / 10, size / 5, size / 5)
            })
        })
    }

    static drawSLRDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawSqLineRotDown(context, scale)
    }
}