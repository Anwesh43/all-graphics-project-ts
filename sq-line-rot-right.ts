const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const delay : number = 20 
const rot : number = Math.PI / 2
const strokeFactor : number = 90 
const sizeFactor : number = 4.9 
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const deg : number = Math.PI / 2

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawXY(context : CanvasRenderingContext2D, x : number, y : number, cb : () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            return 
        }
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawSqLineRotRight(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2 + (w / 2 + size) * dsc(3), h / 2, () => {
            context.rotate(deg * dsc(2))
            for (let k = 0; k < 4; k++) {
                context.rotate(rot * k)
                DrawingUtil.drawXY(context, size / 2, size / 2, () => {
                    for (let j = 0; j < 2; j++) {
                        DrawingUtil.drawXY(context, 0, 0, () => {
                            context.rotate(deg * j * dsc(1))
                            DrawingUtil.drawLine(context, 0, 0, -size * 0.25 * dsc(0), 0)
                        })
                    }
                })
                
            }
        })
    }

    static drawSLRRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawSqLineRotRight(context, scale)
    }
}