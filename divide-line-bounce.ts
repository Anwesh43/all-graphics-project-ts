const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 4 
const sizeFactor : number = 5.9 
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

    static sinify(scale : number) : number {
        return Math.sin(scale * Math.PI)
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

    static drawDivideLineBounce(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(ScaleUtil.sinify(scale), i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        DrawingUtil.drawXY(context, w / 2, h / 2, () => {
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, 0, 0, () => {
                    context.rotate(rot * (1 - 2 * j) * dsc(1))
                    DrawingUtil.drawLine(context, 0, 0, size * dsc(0), 0)
                })
            }
            DrawingUtil.drawXY(context, (w / 2) * (1 - dsc(2)), 0, () => {
                DrawingUtil.drawLine(context, 0, 0, size, 0)
            })
        })       
    }

    static drawDLBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor
        context.strokeStyle = colors[i]
        DrawingUtil.drawDivideLineBounce(context, scale)
    }
}
