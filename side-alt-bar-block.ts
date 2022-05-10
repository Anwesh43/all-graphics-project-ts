const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 5 
const scGap : number = 0.04 / parts 
const delay : number = 20 
const strokeFactor : number = 90 
const sizeFactor : number = 5.9  
const blockSizeFactor : number = 3.9 
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const rot : number = Math.PI / 2 

class ScaleUtil {

    static maxScale(scale :  number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawSideAltBarBlock(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const sc5 : number = ScaleUtil.divideScale(scale, 4, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const barSize : number = size / blockSizeFactor 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc5)
        context.rotate(rot * sc4)
        context.fillRect(-size * 0.5 * sc1, 0, size * sc1, size / 2)
        for (let j = 0;  j < 2; j++) {
            context.save()
            context.translate(-size / 2 + (size - barSize) * j, -(size / 2 - barSize) * ScaleUtil.divideScale(scale, j + 1, parts))
            context.fillRect(0, 0, barSize * Math.floor(sc1), barSize * Math.floor(sc1))
            context.restore()
        }
        context.restore()
    }

    static drawSABBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawSideAltBarBlock(context, scale)
    }
}
