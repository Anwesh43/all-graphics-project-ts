const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 5 
const scGap : number = 0.03 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 8.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const deg : number = Math.PI / 2
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
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }
    
    static drawRightAngleStepLine(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc0 : number = ScaleUtil.divideScale(scale, 0, parts)
        context.save()
        context.translate(w / 2, h / 2)
        for (let j = 0; j < 2; j++) {
            const sc1 : number = ScaleUtil.divideScale(scale, j * 2 + 1, parts)
            const sc2 : number = ScaleUtil.divideScale(scale, j * 2 + 2, parts)
            context.save()
            context.rotate(deg * (1 - 2 * j) * sc1)
            context.translate(0, h * 0.5 * sc2)
            DrawingUtil.drawLine(context, 0, 0, size * sc0, 0)
            context.restore()
        }
        context.restore()
    }

    static drawRASLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle  = colors[i]
        DrawingUtil.drawRightAngleStepLine(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
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