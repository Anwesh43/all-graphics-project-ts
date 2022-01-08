const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const backColor : string  = "#BDBDBD"
const delay : number = 20
const divideFactor : number = 4 
const lines : number = divideFactor + 1 
const parts : number = lines + 2
const scGap : number = 0.06 / parts 
const sizeFactor : number = 6.3
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const strokeFactor : number = 90 
const deg : number = Math.PI  

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

    static drawLineStackOverUp(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, lines, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, lines + 1, parts)
        const uSize : number = size / divideFactor 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2) * sc2)
        context.rotate(deg * sc1)
        for (let k = 0; k < 2; k++) {
            let x = size
            let y = 0 
            context.save()
            context.scale(1 - 2 * k, 1)
            for (let j = 0; j < lines; j++) {
                context.save()
                context.translate(x, y)
                DrawingUtil.drawLine(
                    context,
                    0,
                    0,
                    0,
                    -uSize * ScaleUtil.divideScale(scale, j, parts)
                )
                context.restore()
                x -= uSize 
                y -= uSize 
            }
            context.restore()
        }
        context.restore()
    }

    static drawLSOUNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawLineStackOverUp(context, scale)
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