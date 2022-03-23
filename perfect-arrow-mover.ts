const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const arrowTailFactor : number = 8.9 
const arrowHeadFactor : number = 7.2 
const parts : number = 4 
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 6.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 4 
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

    static drawArrowTail(context : CanvasRenderingContext2D, size : number, sc1 : number, sc2 : number) {
        const tailSize : number = size / arrowTailFactor 
        for (let j = 0; j < 2; j++) {
            context.save()
            context.translate(0, -tailSize)
            context.rotate(rot * sc2 * (1 - 2 * j))
            DrawingUtil.drawLine(context, 0, 0, 0, tailSize * Math.floor(sc1))
            context.restore()
        }
    }
    
    static drawArrowHead(context : CanvasRenderingContext2D, size : number, sc1 : number, sc3 : number) {
        const headSize : number = size / arrowHeadFactor 
        for (let j = 0; j < 2; j++) {
            context.save()
            context.translate(0, -size + headSize)
            context.rotate(rot * (1 - 2 * j) * sc3)
            DrawingUtil.drawLine(context, 0, 0, 0, -headSize * Math.floor(sc1))
            context.restore()
        }
    }

    static drawArrowLine(context : CanvasRenderingContext2D, size : number, sc1 : number, sc2 : number) {
        const tailSize : number = size / arrowTailFactor
        context.save()
        context.translate(0, -tailSize * Math.floor(sc1))
        DrawingUtil.drawLine(context, 0, 0, 0, -size * sc1 + Math.floor(sc1) * tailSize)
        context.restore()
    }

    static drawPAMNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2 - (h / 2) * sc4)
        DrawingUtil.drawArrowLine(context, size, sc1, sc2)
        DrawingUtil.drawArrowTail(context, size, sc1, sc2)
        DrawingUtil.drawArrowHead(context, size, sc1, sc3)
        context.restore()
    }
}