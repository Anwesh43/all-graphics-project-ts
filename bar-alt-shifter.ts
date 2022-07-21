const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 2
const scGap : number = 0.02 / parts 
const bars : number = 5
const sizeFactor : number = 5.9 
const barHFactor : number = 14.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const strokeFactor : number = 90 
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

    static drawBarAltShifter(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const barSize : number = Math.min(w, h) / barHFactor 
        context.save()
        context.translate(w / 2, h)
        for (let i = 0; i < 5; i++) {
            const sci1 : number = ScaleUtil.divideScale(sc1, i, parts)
            const sci2 : number = ScaleUtil.divideScale(sc2, i, parts)
            context.save()
            context.translate((w / 2 + size) * (1 - 2 * i) * sci2, -barSize * i)
            context.fillRect(0, -barSize * sci1, size, barSize * sci1)
            context.restore()
        }
        context.restore()
    }

    static drawBASNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBarAltShifter(context, scale)
    }
}