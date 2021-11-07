const w : number = window.innerWidth 
const h : number = window.innerHeight 
const parts : number = 4 
const scGap : number = 0.03 / parts 
const delay : number = 20 
const strokeFactor : number = 90 
const sizeFactor : number = 12.9 
const colors : Array<string> = [
    "#B71C1C",
    "#33691E",
    "#0091EA",
    "#00BFA5",
    "#FF6D00"
]

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.divideScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawDownHCreateShrink(context : CanvasRenderingContext2D, scale : number) {
        const cSize : number = Math.min(w, h) / sizeFactor 
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = cSize * (1 - sc4)
        context.save()
        context.translate(w / 2, h / 2)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            context.translate(-size / 2, 0)
            for (var k = 0; k < 2; k++) {
                context.save()
                context.translate(0, -h / 2 + (h - size * 0.5 * k) * ScaleUtil.divideScale(scale, j * 2, parts))
                DrawingUtil.drawLine(context, 0, 0, 0, -size / 2)
                context.restore()
            }
            context.restore()
        }
        DrawingUtil.drawLine(
            context,
            -size / 2,
            h / 2 - size / 2,
            -size / 2 + size * sc2,
            h / 2 - size / 2
        )
        context.restore()
    }

    static drawDHCSNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawDownHCreateShrink(context, scale)
    }
}