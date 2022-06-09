const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 6
const scGap : number = 0.05 / parts  
const deg : number = Math.PI 
const strokeFactor : number = 90 
const sizeFactor : number = 11.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const lSizeFactor : number = 3.9 

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

    static drawBallCatchThenRotDrop(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const sc5 : number = ScaleUtil.divideScale(scale, 4, parts)
        const sc6 : number = ScaleUtil.divideScale(scale, 5, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const lSize : number = Math.min(w, h) / lSizeFactor
        context.save()
        context.translate(w / 2, h / 2)
        context.rotate(deg * sc4)
        DrawingUtil.drawLine(context, -lSize * 0.5 * (sc1 - sc6), 0, lSize * 0.5 * (sc1 - sc6), 0)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.translate((lSize - size / 2) * (1 - 2 * j) * sc3, -h / 2 - size / 2 + (h - size / 2) * (sc2 - sc5))
            context.fillRect(-size / 2, -size / 2, size, size)
            context.restore()
        }
        context.restore()
    }

    static drawBCTRDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawBallCatchThenRotDrop(context, scale)
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