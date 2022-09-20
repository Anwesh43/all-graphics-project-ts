const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 5
const scGap : number = 0.04 / parts 
const sizeFactor : number = 5.9 
const rFactor : number = 22.2 
const dealy : number = 20 
const backColor : string = "#BDBDBD"
const strokeFactor : number = 90 
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

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawSquareSideArcShift(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor
        const r : number = Math.min(w, h) / rFactor  
        const dsc : (number) => number = (scale : number) : number => ScaleUtil.divideScale(scale, 0, parts)
        context.save()
        context.translate(w / 2, h / 2 - (h / 2 + size) * dsc(3))
        context.rotate(-rot * dsc(2))
        context.fillRect(-size, -size / 2, size * dsc(0), size)
        for (let j = 0; j < 2; j++) {
            DrawingUtil.drawCircle(context, 0, -h / 2  -r + (h / 2 + size / 2) * dsc(0) - (size - r) * dsc(3), r)
        }
        context.restore()
    }

    static drawSSASNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i] 
        DrawingUtil.drawSquareSideArcShift(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D | null 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        if (this.context) {
            this.context.fillStyle = backColor 
            this.context.fillRect(0, 0, w, h)
        }
    }

    handleTap() {
        this.canvas.onmousedown = () => {

        }
    }

    static init() {
        const stage : Stage = new Stage()
        stage.initCanvas()
        stage.render()
        stage.handleTap()
    }
}
