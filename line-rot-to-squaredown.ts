const w : number = window.innerWidth
const h : number = window.innerHeight
const parts : number = 4 
const strokeFactor : number = 90 
const scGap : number = 0.04 / parts 
const sizeFactor : number = 11.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const deg : number = Math.PI / 2
const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number  {
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

    static drawLineRotToSquareDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        context.save()
        context.translate(w / 2, h / 2 + h * 0.5 * sc4)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            context.translate(0, -size / 2)
            context.rotate(deg * sc2)
            DrawingUtil.drawLine(context, 0, 0, 0, -size * 0.5 * sc1)
            context.restore()
        }
        context.fillRect(-size / 2, 0, size / 2, size * sc3)
        context.restore()
    }
}