const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const backColor : string = "#BDBDBD"
const sizeFactor : number  = 5.9 
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const strokeFactor : number = 90 
const delay : number = 20
const parts : number = 2 
const scGap : number = 0.02 / parts 

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

    static drawTreeNodeBench(context : CanvasRenderingContext2D, scale : number, x : number, y : number, size : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        context.save()
        DrawingUtil.drawLine(context, -size * 0.5 * sc1, 0, size * 0.5 * sc1, 0)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawLine(context, -size / 2, 0, -size / 2, size * 0.25 * sc2)
            context.restore()
        }
        context.restore()
    }

    static drawTNB(context : CanvasRenderingContext2D, i : number, scale : number, x : number, y : number, size : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawTreeNodeBench(context, scale, x, y, size)
    }
}
