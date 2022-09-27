const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const sizeFactor : number = 8.9 
const delay : number = 20 
const bacKColor : string = "#BDBDBD"
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

    static drawBar(context  : CanvasRenderingContext2D, size : number, sc1 : number, sc2 : number) {
        context.save()
        context.translate(0, -size / 2)
        context.fillRect(-size * 0.5 * sc1, -size / 2, size * sc1, size)
        context.rotate(sc2 * Math.PI / 2)
        context.fillRect(-size * 0.5 * sc1, -1.5 * size, size * sc1, size)
        context.restore()
    }

    static drawRectBarBiSideExploder(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number)  : number => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate(w / 2, h)
        for (let j = 0; j < 3; j++) {
            const k : number = j % 2 
            const n : number = Math.floor(j / 2)
            const ki : number = (1 - k)
            context.save()
            context.translate((w / 2 + size / 2) * (1 - 2 * n) * ki * dsc(2), -(h / 2 + size / 2) * (1 - k) * dsc(3))
            DrawingUtil.drawBar(context, size, dsc(0), dsc(1))
            context.restore()
        }
        context.restore()
    }

    static drawRBBSENode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i] 
        context.fillRect(0, 0, w, h)
        DrawingUtil.drawRectBarBiSideExploder(context, scale)
    }
}