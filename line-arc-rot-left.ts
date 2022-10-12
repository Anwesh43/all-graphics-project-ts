const colors : Array<string> = [
    "#AB47BC",
    "#1E88E5",
    "#00E678",
    "#FF3D00",
    "#3D5AFE"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 4.9 
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
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawArc(context : CanvasRenderingContext2D, x : number, y : number, r : number, start : number, deg : number, scale : number) {
        context.beginPath()
        for (let j = start; j <= start + deg * scale; j++) {
            const cx : number = x + r * Math.cos(j * Math.PI / 180)
            const cy : number = y + r * Math.sin(j * Math.PI / 180)
            if (j == 0) {
                context.moveTo(cx, cy)
            } else {
                context.lineTo(cx, cy)
            }
        }
        context.stroke()
    }

    static drawLineArcRotLeft(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2 - (w / 2 + size) * dsc(3), h / 2)
        context.rotate(rot * dsc(2))
        DrawingUtil.drawLine(context, 0, 0, size * dsc(0), 0)
        DrawingUtil.drawArc(context, size / 2, 0, size / 2, 180, 180, dsc(1))
        context.restore()
    }

    static drawLARLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawLineArcRotLeft(context, scale)
    }
}