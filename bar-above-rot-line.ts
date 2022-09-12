const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 5 
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 11.2 
const delay : number = 20 
const backColor : string = "#bdbdbd"
const rot : number = Math.PI / 2
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const barFactor : number = 13.9

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
    
    static drawBarAboveRotLine(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const barSize : number = Math.min(w, h) / barFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate(w / 2 + (w / 2) * dsc(4), h / 2)
        context.rotate(rot * dsc(2))
        DrawingUtil.drawLine(context, -size * 0.5 * dsc(0), 0, size * 0.5 * dsc(0), 0)
        context.save()
        context.translate((-size / 2 + barSize / 2) * (1 - dsc(3)), 0)
        context.fillRect(-barSize / 2, -barSize * dsc(1), barSize, barSize * dsc(1))
        context.restore()
        context.restore()
    }

    static drawBARLNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = backColor
        DrawingUtil.drawBarAboveRotLine(context, scale)
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