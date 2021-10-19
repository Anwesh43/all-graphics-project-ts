const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 4 
const scGap : number = 0.03 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 11.2
const backColor : string = "#bdbdbd"
const delay : number = 20 
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
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawSmallLargeLineUp(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        context.save()
        context.translate(w / 2, h / 2 - (h / 2) * sc4)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.translate(-size / 2 + size * j, 0)
            DrawingUtil.drawLine(context, 0, 0, 0, -(size / 2 + size * 0.5 * j) * ScaleUtil.divideScale(scale, j, parts))
            context.restore()
        }
        context.save()
        context.translate(0, h * 0.5 * (1 - sc3))
        DrawingUtil.drawLine(context, -size / 2, 0, size / 2, 0)
        context.restore()
        context.restore()
    }

    static drawSLLUNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawSmallLargeLineUp(context, scale)
    }
}
