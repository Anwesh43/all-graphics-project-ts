const w : number = window.innerWidth 
const h : number = window.innerHeight 
const parts : number = 3
const scGap : number = 0.02 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 12.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const arrowSizeFactor : number = 32.1
const deg : number = Math.PI / 4

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

    static drawExpandArrowGo(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const arrowSize : number = Math.min(w, h) / arrowSizeFactor 
        context.save()
        context.translate(w / 2, h / 2)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.scale(1, 1 - 2 * j)
            context.translate(w * 0.5 * sc3, -h * 0.5 * sc3)
            DrawingUtil.drawLine(context, 0, -arrowSize, 0, -arrowSize - (size - arrowSize) * sc1)
            for (var k = 0; k < 2; k++) {
                const upSize : number = arrowSize * Math.floor(sc1)
                context.save()
                context.translate(0, -size)
                context.rotate(deg * sc2 * (1 - 2 * k))
                DrawingUtil.drawLine(context, 0, 0, 0, arrowSize)
                context.restore()
            }
            context.restore()
        }
        context.restore()
    }

    static drawEAGNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawExpandArrowGo(context, scale)
    }
}