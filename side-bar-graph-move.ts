const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 3
const scGap : number = 0.03 / parts 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const sizeFactor : number = 5.9 
const wFactor : number = 11.2 
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

    static drawSideBarGraphMove(context : CanvasRenderingContext2D, scale : number) {
        const barW : number = Math.min(w, h) / wFactor 
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate(w / 2, -(h / 2) * (1 - dsc(0)) + h / 2 + (h / 2 + size) * dsc(2))
        for (let j = 0; j < 2; j++) {
            const barH : number = (size) * (1 - dsc(1)) * (1 - j) + size * j * dsc(1)
            context.save()
            context.translate(w / 2 + barW * (j - 1), 0)
            context.fillRect(0, -barH, barW, barH)
            context.restore()
        }
        context.restore()
    }
    
    static drawSBGMNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawSideBarGraphMove(context, scale)
    }
}