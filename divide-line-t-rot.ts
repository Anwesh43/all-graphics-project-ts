const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 2
const delay : number = 20 
const strokeFactor : number = 90 
const sizeFactor : number = 11.2
const w : number = window.innerWidth 
const h : number = window.innerHeight
const parts : number = 4
const scGap : number = 0.04 / parts 

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

    static drawDivideLineToRot(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const sc11 : number = ScaleUtil.divideScale(sc1, 0, parts)
        const sc12 : number = ScaleUtil.divideScale(sc1, 1, parts)
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc4)
        context.rotate(rot * sc3)
        DrawingUtil.drawLine(context, -size, 0, -size + size * sc11, 0)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.rotate(rot * (1 - 2 * j) * sc2)
            DrawingUtil.drawLine(context, 0, 0, size * sc12, 0)
            context.restore()
        }
        context.restore()
    }

    static drawDLTRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawDivideLineToRot(context, scale)
    }
}