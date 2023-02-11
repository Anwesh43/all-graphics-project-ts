const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90
const sizeFactor : number = 4.9 
const rFactor : number = 15.9 
const delay : number = 20 
const rot : number = Math.PI / 2
const backColor : string = "#BDBDBD"

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number { 
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

interface Dimension {
    w : number, 
    h : number
}

class DimensionController {

    private static w : number = window.innerWidth
    private static h : number = window.innerHeight 
    
    static handleResize() {
        window.onresize = () => {
            DimensionController.w = window.innerWidth 
            DimensionController.h = window.innerHeight 
        }
    }

    static getDimension() : Dimension {
        return {
            w : DimensionController.w, 
            h : DimensionController.h
        }
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

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawBallRotLine(context : CanvasRenderingContext2D, w : number, h : number, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const r : number = Math.min(w, h) / rFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 + (h / 2 + size) * dsc(4), () => {
            DrawingUtil.drawXY(context, -w / 2 + (w / 2) * dsc(0), 0, () => {
               context.rotate(rot * dsc(3))
               DrawingUtil.drawLine(context, 0, 0, -size, 0) 
            })

            DrawingUtil.drawXY(context, (w / 2) * (1 - dsc(1)), 0, () => {
                context.rotate(rot * dsc(2))
                DrawingUtil.drawCircle(context, r, 0, r)
            })
        })        
    }

    static drawBRLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        const {w, h} = DimensionController.getDimension()
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawBallRotLine(context, w, h, scale)
    }
}

class Stage {
    
    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D | null 

    initCanvas() {
        const {w, h} = DimensionController.getDimension()
        this.canvas.width = w
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas) 
        DimensionController.handleResize()
    }

    render() {
        if (this.context) {
            const {w, h} = DimensionController.getDimension()
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

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : () => void) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb()
        }
    }
    
    startUpdating(cb : () => void) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : () => void) {
        if (!this.animated) {
            this.animated = true 
            this.interval = setInterval(cb, delay)
        }
    }

    stop() {
        if (this.animated) {
            this.animated = false 
            clearInterval(this.interval)
        }
    }
}