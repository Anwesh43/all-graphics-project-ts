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
const barFactor : number = 12.9 
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

    static drawXY(context : CanvasRenderingContext2D, x : number, y : number, cb : () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawAltSideBarLineDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const bar : number = Math.min(w, h) / barFactor 
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2) * dsc(3), () => {
            context.rotate(rot * dsc(2))
            DrawingUtil.drawXY(context, 0, (h / 2 + context.lineWidth) * (1 - dsc(0)), () => {
                DrawingUtil.drawLine(context, 0, 0, -size, 0)
            })

            DrawingUtil.drawXY(context, -size, -h / 2 + (h / 2) * dsc(1), () => {
                context.fillRect(0, -bar, bar, bar)
            })
        })
    }

    static drawASBLDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.fillStyle = colors[i]
        DrawingUtil.drawAltSideBarLineDown(context, scale)
    }
}