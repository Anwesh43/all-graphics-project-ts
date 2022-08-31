const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#03DAC6",
    "#D50000",
    "#43A047"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const sizeFactor : number = 4.9
const barWFactor : number = 11.9 
const rot : number = Math.PI / 2
const strokeFactor : number = 90 
const w : number = window.innerWidth
const h : number = window.innerHeight 

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale  - i / n)
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

    static drawBarEdgeLineRot(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const barW : number = Math.min(w, h) / barWFactor 
        context.save()
        context.translate(w / 2 - (w / 2 + size) * dsc(3), h / 2)
        
        DrawingUtil.drawLine(context, 0, 0, size * dsc(0), 0)
        context.save()
        context.rotate(rot * dsc(2))
        context.fillRect(-barW / 2, -size * dsc(1), barW, size * dsc(1))
        context.restore()
        context.restore()
    }

    static drawBELRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawBarEdgeLineRot(context, scale)
    }
}