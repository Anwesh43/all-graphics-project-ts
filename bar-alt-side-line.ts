const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const parts : number = 4 
const scGap : number = 0.04 / parts 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const sizeFactor : number = 9.2 
const strokeFactor : number = 90 
const deg : number = Math.PI 

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

    static drawAtXY(context : CanvasRenderingContext2D, x : number, y : number, cb : Function) {
        context.save()
        context.translate(x, y)
        cb(context)
        context.restore()
    }

    static drawBarAltSideLine(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc4)
        context.rotate(deg * sc4)
        for (let j = 0; j < 2; j++) {
            
            DrawingUtil.drawAtXY(context, -size / 2, h * 0.5 * (1 - sc1) - size * 0.25 * (1 - 2 * j) * sc3, (context : CanvasRenderingContext2D) => {
                DrawingUtil.drawLine(context, 0, 0, size, 0)
            })
        } 

        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawAtXY(context, -w / 2 - size / 2 + (w / 2 - size) * sc2, -size / 4, (context : CanvasRenderingContext2D) => {
                context.fillRect(0, 0, size / 2, size / 2)
            })
            context.restore()
        }
        context.restore()
    }
    
    static drawBASLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawBarAltSideLine(context, scale)
    }
}