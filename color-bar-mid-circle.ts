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
const sizeFactor : number = 11.9 
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

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawColorBarMidCircle(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const barSize : number = size / 5 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc4)
        context.rotate(rot * sc3)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawCircle(context, 0, 0, (size / 4) * sc1)
            context.save()
            context.translate(-size / 2, 0)
            context.fillRect(0, -size * 0.5 * (1 + j) * sc2, barSize, size * (0.5) * (1 + j) * sc2)
            context.restore()
            context.restore()
        }
        context.restore()
    }

    static drawCBMCNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        context.lineWidth = Math.min(w, h) / sizeFactor 
        DrawingUtil.drawColorBarMidCircle(context, scale)
    }
}