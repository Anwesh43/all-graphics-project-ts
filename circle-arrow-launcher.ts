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
const sizeFactor : number = 4.9 
const backColor : string = "#BDBDBD"
const triSizeFactor : number = 11.9 
const delay : number = 20 
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
    
    static drawTriArrow(context : CanvasRenderingContext2D, x : number, y : number, size : number, sc1 : number, sc2 : number) {
        context.save()
        context.translate(x, y)
        context.rotate(sc2 * Math.PI )
        context.beginPath()
        context.moveTo(0, -size / 2)
        context.lineTo(size, 0)
        context.lineTo(0, size / 2)
        context.lineTo(0, -size / 2)
        context.clip()
        context.fillRect(0,  -size / 2, size * sc1, size)
        context.restore()
    }

    

    static drawCircleArrowLauncher(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, 0, parts)
        const r : number = Math.min(w, h) / sizeFactor 
        const size : number = Math.min(w, h) / triSizeFactor
        context.save()
        context.translate(w / 2, h / 2)
        DrawingUtil.drawCircle(context, 0, (h / 2 + r) * dsc(4), r * dsc(0))
        for (let j = 0 ; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawTriArrow(context, -w / 2 + (w / 2 - r) * dsc(2) - (w / 2 + size) * dsc(3), 0, size, dsc(1), dsc(2))
            context.restore()
        }
        context.restore()
    }

    static drawCALNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawCircleArrowLauncher(context, scale)
    }
}