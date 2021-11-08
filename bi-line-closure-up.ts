const colors : Array<string> = [
    "#B71C1C",
    "#33691E",
    "#0091EA",
    "#00BFA5",
    "#FF6D00"
]
const backColor : string = "#BDBDBD"
const delay : number = 20 
const w : number = window.innerWidth 
const h : number = window.innerHeight
const strokeFactor : number = 90
const sizeFactor : number = 11.2  
const parts : number = 3
const scGap : number = 0.03 / parts 

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

    static drawBiLineClosureUp(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        context.save()
        context.translate(w / 2, h / 2)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            context.translate(0, -h / 2 + h  * sc1)
            DrawingUtil.drawLine(context, -size / 2, 0, -size / 2, -size)
            context.restore()
        
        }
        DrawingUtil.drawLine(context, -size / 2, h / 2 - size, -size / 2 + size * sc2, h / 2 - size)
        context.restore()
    }

    static drawBLCUNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawBiLineClosureUp(context, scale)
    }
}