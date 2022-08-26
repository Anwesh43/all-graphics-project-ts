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
const deg : number = Math.PI / 2
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

    static drawBarRectRotSide(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) : number => {
            return ScaleUtil.divideScale(scale, i, parts)
        } 
        
        context.save()
        context.translate(w / 2, h / 2)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1 - 2 * j)
            context.translate((w / 2) * dsc(3), size)
            context.save()
            context.rotate(deg * dsc(1))
            DrawingUtil.drawLine(context, 0, 0, 0, -size * dsc(0))
            context.restore()
            context.fillRect(0, -size / 2, size * dsc(2), size / 2)
            context.restore()
        }
        context.restore()
    }

    static drawBRRSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawBarRectRotSide(context, scale)
    }
}