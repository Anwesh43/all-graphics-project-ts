const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const backColor : string = "#BDBDBD"
const delay : number = 20 
const parts : number = 4
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const deg : number = Math.PI / 2
const sizeFactor : number = 11.9 
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

    static drawOpenLine(context : CanvasRenderingContext2D, size : number, sc1 : number, sc2 : number, sc3 : number) {
        context.save()
        context.translate(0, -size + size * sc3)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.rotate(deg * (1 - 2 * j) * sc2)
            DrawingUtil.drawLine(context, 0, 0, 0, size * sc1)
            context.restore()
        }
        context.restore()
    }

    static drawArms(context : CanvasRenderingContext2D, size : number, sc3 : number) {
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            context.translate(-size, -size)
            DrawingUtil.drawLine(context, 0, 0, 0, size * sc3)
            context.restore()
        }
    }

    static drawOpenLineArmDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        context.save()
        context.translate(w / 2, h / 2)
        DrawingUtil.drawOpenLine(context, size, sc1, sc2, sc3)
        DrawingUtil.drawArms(context, size, sc3)
        context.restore()     
    }

    static drawOLADNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawOpenLineArmDown(context, scale)
    }
}