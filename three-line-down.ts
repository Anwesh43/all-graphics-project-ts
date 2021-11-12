const colors : Array<string> = [
    "#B71C1C",
    "#33691E",
    "#0091EA",
    "#00BFA5",
    "#FF6D00"
]
const parts : number = 3
const scGap : number = 0.03 / parts 
const delay : number = 20 
const lines : number = 3 
const strokeFactor : number = 90
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const sizeFactor : number = 12.9 
const backColor : string = "#BDBDBD"

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawATXY(context : CanvasRenderingContext2D, x : number, y : number, cb : Function) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }
    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawThreeLineDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        DrawingUtil.drawATXY(context, w / 2, h / 2, () => {
            
            for (var j = 0; j < lines; j++) {
                const x : number = w / 4 + (w / 3) * j 
                DrawingUtil.drawATXY(context, x, h * 0.5 * sc3, () => {
                    DrawingUtil.drawLine(context, -size * 0.5 * sc1, 0, size * 0.5 * sc1, 0)
                })
                DrawingUtil.drawATXY(context, x, -h / 2 + (h * 0.5 - size) * sc2 + (h * 0.5 + size) * sc3, () => {
                    DrawingUtil.drawLine(context, 0, 0, 0, size)
                }) 
            }
        })
    }

    static drawTLDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.strokeStyle = colors[i]
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawThreeLineDown(context, scale)
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