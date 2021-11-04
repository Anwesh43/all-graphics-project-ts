const w : number = window.innerWidth
const h : number = window.innerHeight 
const parts : number = 3
const scGap : number = 0.03
const lines : number = 5 
const sizeFactor :  number = 11.9 
const strokeFactor : number = 90 
const delay : number = 20 
const deg : number = Math.PI / 2 
const backColor : string = "#BDBDBD"
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

    static drawMultiLUpDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        context.save()
        context.translate(w / 2 - (size * lines) / 2, h / 2)
        for (var j = 0; j < lines; j++) {
            const sc3j : number = ScaleUtil.divideScale(sc3, j, parts);
            const sc1j : number = ScaleUtil.divideScale(sc1, j, parts)
            context.save()
            context.translate(
                0,
                -h / 2 + (h / 2) * sc1j + (h / 2 + size) * sc3j)
            context.rotate(deg * ScaleUtil.divideScale(sc2, j, parts))
            DrawingUtil.drawLine(context, 0, 0, 0, -size)
            context.restore()
        }
        context.restore()
    }

    static drawMLUDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawMultiLUpDown(context, scale)
    }
}