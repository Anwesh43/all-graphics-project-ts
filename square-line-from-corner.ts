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
const sizeFactor : number = 6.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 2 
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

    static drawSquareLineFromCorner(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2 - (h / 2 + size) * dsc(3))
        context.rotate(rot * dsc(2))
        context.fillRect(-size * 0.5 * dsc(0), size * 0.5 * dsc(0), size * dsc(0), size * dsc(0))
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1, 1 - 2 * j)
            context.translate(size / 2, -size / 2)
            DrawingUtil.drawLine(context, 0, 0, size * 0.5 * dsc(1), -size * 0.5 * dsc(1))
            context.restore()
        }
        DrawingUtil.drawLine(context, -size / 2, 0, -size / 2 - size * 0.5 * dsc(1), 0)
        context.restore()
    }

    static drawSLFCNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.lineCap = 'round'
        context.fillStyle = colors[i]
        context.strokeStyle = colors[i]
        DrawingUtil.drawSquareLineFromCorner(context, scale)
    }
}