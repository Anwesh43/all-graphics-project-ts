const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 4 
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 12.9 
const deg : number = Math.PI / 4 
const delay : number = 20 
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

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawSplitLineBarDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + 2 * size) * sc4)
        context.save()
        context.translate(0, -h / 2 + (h / 2 - size) * sc2)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.rotate(deg * (1 - 2 * j) * (1 - sc3))
            DrawingUtil.drawLine(context, 0, 0, 0, -size)
            context.restore()
        }
        context.restore()
        context.fillRect(-size / 2, -size * sc1, size / 2, 0)
        context.restore()
    }

    static drawSLBDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawSplitLineBarDown(context, scale)
    }
}