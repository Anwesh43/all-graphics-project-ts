const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const sizeFactor : number = 4.7
const triSizeFactor : number = 15.2 
const parts : number = 5
const scGap : number = 0.04 / 5 
const deg : number = Math.PI / 2
const lines : number = 3 
const strokeFactor : number = 90 
const backColor : string = "#BDBDBD"
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
    
    static drawTridentRotRight(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor  
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const sc5 : number = ScaleUtil.divideScale(scale, 4, parts)
        const triSize : number = Math.min(w, h) / triSizeFactor 
        context.save()
        context.translate(w / 2 + (w / 2) * sc5, h / 2)
        context.rotate(deg * sc4)
        DrawingUtil.drawLine(context, 0, 0, 0, -size * sc1)
        DrawingUtil.drawLine(context, -triSize * sc2 * 0.5, -size, triSize * 0.5 * sc2, -size)
        for (let j = 0; j < 3; j++) {
            context.save()
            context.translate(-triSize / 2 + triSize * 0.5 * j, -size)
            DrawingUtil.drawLine(context, 0, 0, 0, -triSize * sc3)
            context.restore()
        }
        context.restore()
    }

    static drawTRRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawTridentRotRight(context, scale)
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