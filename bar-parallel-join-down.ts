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
const delay : number = 20 
const barWFactor : number = 14.9 
const rot : number = Math.PI / 2
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
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            return 
        }
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawBarParallelJoinDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor
        const barW : number = Math.min(w, h) / barWFactor  
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * dsc(3))
        context.rotate(rot * dsc(2))
        context.save()
        context.translate(w * 0.5 * (1 - dsc(1)), 0)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.translate(0, (-size / 2 + size * j) * (1 - dsc(2)))
            DrawingUtil.drawLine(context, 0, 0, size, 0)
            context.restore()
        }
        context.restore()
        context.fillRect(-barW, size / 2 - size * dsc(0), barW, size * dsc(0))
        context.restore()
    }

    static drawBPJDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        context.lineCap = 'round'
        DrawingUtil.drawBarParallelJoinDown(context, scale)
    }
}
