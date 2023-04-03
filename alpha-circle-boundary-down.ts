const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90
const sizeFactor : number = 4.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const alphaDec : number = 0.6

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

    static drawStrokeCircle(context : CanvasRenderingContext2D, cx : number, cy : number, r : number, deg : number) {
        context.beginPath()
        for (let j = 0; j <= deg; j++) {
            const x : number = cx + r * Math.cos(j * deg * Math.PI / 180)
            const y : number = cy + r * Math.sin(j * Math.PI / 180)
            if (j == 0) {
                context.moveTo(x, y)
            } else {
                context.lineTo(x, y)
            }
        }
        context.stroke()
    }

    static drawXY(context : CanvasRenderingContext2D, x : number, y : number, cb : () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawAlphaCircleBoundaryDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2, () => {
            DrawingUtil.drawXY(context, 0, 0, () => {
                context.globalAlpha = 1 - alphaDec * dsc(1)
                DrawingUtil.drawCircle(context, 0, 0, size * dsc(1))
            })
            DrawingUtil.drawXY(context, 0, 0, () => {
                context.globalAlpha = 1
                DrawingUtil.drawStrokeCircle(context, 0, 0, size, 360 * dsc(2))
            })
        })       
    }

    static drawACBDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawAlphaCircleBoundaryDown(context, scale)
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