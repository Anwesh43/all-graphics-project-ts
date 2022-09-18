const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const rFactor : number = 18.9 
const barFactor : number = 4.9 
const delay : number = 20 
const deg : number = 2 * Math.PI / 3
const rot : number = 2 * Math.PI 
const backColor : string = "#bdbdbd"
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

    static drawFanMidBallRotShift(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        const barSize : number = Math.min(w, h) / barFactor 
        const r : number = Math.min(w, h) / rFactor 
        context.save()
        context.translate(w / 2 + (w / 2 + r + barSize) * dsc(3), h / 2)
        context.rotate(rot * dsc(3))
        DrawingUtil.drawCircle(context, 0, (h / 2 + r) * (dsc(1) - 1), r)
        for (let j = 0; j < 3; j++) {
            context.save()
            context.rotate(deg * dsc(2) * j)
            context.fillRect(r, -r / 2, barSize * dsc(0), r)
            context.restore()
        }
        context.restore()
    }

    static drawFMBRSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawFanMidBallRotShift(context, scale)
    }
}