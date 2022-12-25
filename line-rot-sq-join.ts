const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 6
const scGap : number = 0.05 / parts 
const delay : number = 20 
const rot : number = Math.PI / 2
const backColor : string = "#BDBDBD"
const sizeFactor : number = 4.9 
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
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            return 
        }
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

    static drawLineRotSqJoin(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        DrawingUtil.drawXY(context, w / 2 + (w / 2 + size) * dsc(5), h / 2, () => {
            context.rotate(rot * dsc(4))
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, 0, 0, () => {
                    context.scale(1 - 2 * j, 1)
                    DrawingUtil.drawXY(context, -size * 0.5 * dsc(3), 0, () => {
                        DrawingUtil.drawXY(context, 0, 0, () => {
                            context.rotate(rot * dsc(1))
                            DrawingUtil.drawLine(context, 0, 0, 0, -size * dsc(0))
                        })
                        DrawingUtil.drawXY(context, 0, 0, () => {
                            context.scale(1, 1 - 2 * j)
                            context.fillRect(0, 0, size, size * dsc(2))
                        })
                    })
                })
            }
        })
    }

    static drawLRSJNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawLineRotSqJoin(context, scale)
    }
}