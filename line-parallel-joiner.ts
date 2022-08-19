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
const sizeFactor : number = 11.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 2
const w : number = window.innerWidth 
const h : number = window.innerHeight 

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n :number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawLine(
        context : CanvasRenderingContext2D,
        x1 : number,
        y1 : number,
        x2 : number,
        y2 : number) {
            context.beginPath()
            context.moveTo(x1, y1)
            context.lineTo(x2, y2)
            context.stroke()
    }

    static drawLineParallelJoiner(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc4)
        context.rotate(rot * sc3)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1, 1 - 2 * j)
            context.translate(0, -size * 0.5)
            DrawingUtil.drawLine(context, -size * 0.5 * sc1, 0, size * 0.5 * sc1, 0)
            for (let k = 0; k < 2; k++) {
                context.save()
                context.scale(1 - 2 * k, 1)
                DrawingUtil.drawLine(context, 0, 0, size * 0.5 * sc2, size * 0.5 * sc2)
                context.restore()
            }
            context.restore()
        }
        context.restore()
    }

    static drawLPJNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawLineParallelJoiner(context, scale)
    }
}