const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 5.9 
const rot : number = Math.PI / 2
const delay : number = 20 
const BACKcoLOR : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const barSizeFactor : number = 9.2 

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

    static drawLineBreakSquareDown(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = Math.min(w, h) / sizeFactor
        const barSize : number = Math.min(w, h) / barSizeFactor  
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc4)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            context.rotate(rot * sc3)
            DrawingUtil.drawLine(context, 0, 0, size * sc1, 0)
            context.fillRect((size - barSize), 0, barSize, barSize * sc2)
            context.restore()
        }
        context.restore()
    }

    static drawLBSDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawLineBreakSquareDown(context, scale)
    }
}