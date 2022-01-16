const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 5 
const scGap : number = 0.04 / parts 
const delay : number = 20 
const strokeFactor : number = 90 
const sizeFactor : number = 8.9 
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const deg : number = Math.PI / 2
const barWFactor : number = 5.9 

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

    static drawBarShooterAlternate(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const barW : number = Math.min(w, h) / barWFactor
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const sc5 : number = ScaleUtil.divideScale(scale, 4, parts)
        const upSize : number = size * 0.5 * (sc1 - sc5)
        const y : number = h / 2 - (h / 2) * sc2 + (w / 2) * sc4
        context.save()
        context.translate(w / 2, h / 2)
        context.rotate(deg * sc3)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1 - 2 * j)
            context.translate(size / 2 - barW, y)
            context.fillRect(0, 0, barW, size)
            context.restore()
        }
        DrawingUtil.drawLine(context, -upSize, 0, upSize, 0)
        context.restore()
    }

    static drawBSANode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawBarShooterAlternate(context, scale)
    }
}