const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 4 
const scGap : number = 0.04 / parts 
const sizeFactor : number = 11.9 
const delay : number = 20 
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 2

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawBarVertRot(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        context.save()
        context.translate(w / 2 + (w / 2 + size) * sc4, h / 2)
        context.rotate(rot * sc3)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1 - 2 * j)
            context.translate(0, size / 2 - size * 0.5 * sc2)
            context.fillRect(-size / 2, -size * sc1, size / 2 , size * sc1)
            context.restore()
        }
        context.restore()
    }

    static drawBVRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBarVertRot(context, scale)
    }
}