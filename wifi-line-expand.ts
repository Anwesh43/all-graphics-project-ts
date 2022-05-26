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
const sizeFactor : number = 7.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const rot : number = Math.PI / 2 
const lines : number = 5 

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n , ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawWifiLineExpand(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const lineH : number = (size / 2) / lines 
        const lineGap : number = (size) / (lines - 1) 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size / 2) * sc1)
        context.rotate(rot * sc3)
        context.rotate(rot * sc1)
        for (let j = 1; j <= 5; j++) {
            context.save()
            context.translate(-size / 2 + lineGap * (j - 1), 0)
            DrawingUtil.drawLine(context, 0, 0, 0, -lineH * sc1)
            context.restore()
        }
        DrawingUtil.drawLine(context, -size * 0.5 * sc2, 0, size * 0.5 * sc2, 0)
        context.restore()
    }

    static drawWLENode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.strokeStyle = colors[i]
        context.lineWidth = Math.min(w, h) / strokeFactor
        DrawingUtil.drawWifiLineExpand(context, scale) 
    }
}