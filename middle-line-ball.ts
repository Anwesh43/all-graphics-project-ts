const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 4
const scGap : number = 0.03 / parts 
const rFactor : number = 11.9 
const w : number = window.innerWidth
const h : number = window.innerHeight 
const strokeFactor : number = 90 
const delay : number = 20 
const backColor : string = "#BDBDBD"


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
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawMiddleLineBall(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const r : number = Math.min(w, h) / rFactor 
        context.save()
        context.translate(w / 2, h / 2)
        if (sc1 > 0 && sc3 < 1) {
            DrawingUtil.drawLine(context, 0, -h / 2 + h  * sc3, 0, -h / 2 + h * sc1)
        }
        if (sc2 > 0 && sc4 < 1) {
            for (var j = 0; j < 2; j++) {
                context.save()
                context.scale(1 - 2 * j, 1 - 2 * j)
                DrawingUtil.drawCircle(context, 3 * r, 3 * r, r * (sc2 - sc4))
                context.restore()
            }
        }
        context.restore()
    }

    static drawMLBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawMiddleLineBall(context, scale)
    }
}