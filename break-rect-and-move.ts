const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 3
const scGap : number = 0.03 / parts 
const strokeFactor : number = 90 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const sizeFactor : number = 11.2 
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

    static drawBreakRectAndMove(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const size : number = Math.min(w, h) / sizeFactor
        context.save()
        context.translate(w / 2, h / 2)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1 - 2 * j)
            context.translate(0, (h / 2 + size) * sc3)
            context.fillRect(0, -size / 2, size * sc2, size)
            context.save()
            context.translate(size * sc2, 0)
            DrawingUtil.drawLine(context, 0, -size * 0.5 * sc1, 0, size * 0.5 * sc1)
            context.restore()
            context.restore()
        }
        context.restore()
    }

    static drawBRAMNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        context.strokeStyle = colors[i]
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawBreakRectAndMove(context, scale)
    }
}