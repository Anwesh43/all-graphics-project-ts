const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 6.9 
const rFactor : number = 24.9 
const delay : number = 20 
const rot : number = Math.PI / 2
const backColor : string = "#BDBDBD"
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
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            return 
        }
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawLineArc(context : CanvasRenderingContext2D, r : number, start : number, end : number) {
        context.beginPath()
        for (let j = start; j <= end; j++) {
            const x : number = r * Math.cos(j * Math.PI / 180)
            const y : number = r * Math.sin(j * Math.PI / 180)
            if (j == start) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
    }

    static drawArcCircleRotation(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor
        const r : number = Math.min(w, h) / rFactor  
        context.save()
        context.translate(w / 2, h / 2 - (h  / 2) * dsc(3))
        
        context.rotate(rot * 0.5 * dsc(2))
        
        DrawingUtil.drawLineArc(context, size, -rot, rot * (dsc(1) - 1))
        context.save()
        context.rotate(rot * dsc(1))
        DrawingUtil.drawCircle(context, 0, -size - r, r * dsc(0))
        context.restore()
        context.restore()
    } 

    static drawACRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawArcCircleRotation(context, scale)
    }
}