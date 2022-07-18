const colors : Array<string> = [
    "#B71C1C",
    "#00C853",
    "#0091EA",
    "#AA00FF",
    "#FFAB00"
]
const parts : number = 5
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 5.9 
const delay : number = 20 
const rot : number = Math.PI / 2
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth
const h : number = window.innerHeight 
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

    static drawSideRotLine(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const sc5 : number = ScaleUtil.divideScale(scale, 4, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc5)
        context.rotate(deg * sc4)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.translate(w / 2, h / 2)
            DrawingUtil.drawLine(context, -size * 0.5 * sc1, 0, size * 0.5 * sc1, 0)
            context.save()
            context.translate(size / 2, 0)
            context.rotate(-deg * sc3)
            DrawingUtil.drawLine(context, 0, 0, 0, -size * 0.5 * sc2)
            context.restore()
            context.restore()
        }
        context.restore()
    }

    static drawSRLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawSideRotLine(context, scale)
    }
}