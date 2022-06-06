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
const sqSizeFactor : number = 8.9 
const delay : number = 20 
const rot : number = Math.PI / 2 
const w : number = window.innerWidth 
const h : number = window.innerHeight 
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

    static drawSqDropRotDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const barSize : number = Math.min(w, h) / sqSizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        context.save()
        context.translate(w / 2, h / 2)
        context.rotate(rot * sc2)
        context.translate(-(w / 2 + size / 2) * (1 - sc1), (h / 2) * sc4)
        DrawingUtil.drawLine(context, -size * 0.5 * (1 - sc3), 0, size * 0.5 * (1 - sc3), 0)
        context.fillRect(-barSize / 2, -barSize, barSize, barSize)
        context.restore()
    }

    static drawSDRDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.lineCap = 'round'
        context.strokeStyle = colors[i]
        DrawingUtil.drawSqDropRotDown(context, scale)
    }
}