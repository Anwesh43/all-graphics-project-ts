const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 5 
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 7.9 
const barSizeFactor : number = 28.9 
const delay  : number = 20
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const rot : number = Math.PI / 2

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

    static drawMidBlockCreator(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) /  strokeFactor 
        const barSize : number = Math.min(w, h) / barSizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const sc5 : number = ScaleUtil.divideScale(scale, 4, parts)
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc5)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.rotate(rot * j * sc4)
            context.save()
            context.translate(0, -size / 2)
            context.fillRect(-barSize * 0.5 * sc1, -barSize * 0.5 * sc1, barSize * sc1, barSize * sc1)
            context.restore()
            if (sc2 > 0) {
                DrawingUtil.drawLine(context, 0, -size / 2, size * 0.5 * sc2, -size / 2)
            }
            if (sc3 > 0) {
                DrawingUtil.drawLine(context, size / 2, -size / 2 ,size / 2, -size / 2 + size * 0.5 * sc3)
            }
            context.restore()
        }
        context.restore()
    }

    static drawMBCNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawMidBlockCreator(context, scale)
    }
}
