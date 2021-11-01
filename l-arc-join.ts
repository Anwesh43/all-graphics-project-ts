const w : number = window.innerWidth
const h : number = window.innerHeight 
const parts : number = 3 
const strokeFactor : number = 90 
const sizeFactor : number = 11.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const deg : number = 90
const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]

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

    static drawArc(context : CanvasRenderingContext2D, x : number, y : number, r : number, sc : number) {
        context.save()
        context.translate(x, y)
        context.beginPath()
        for (var j = 0; j <= deg * sc; j++) {
            const a : number = r * Math.cos(j * Math.PI / 180)
            const b : number = r * Math.sin(j * Math.PI / 180)
            if (j == 0) {
                context.moveTo(a, b)
            } else {
                context.lineTo(a, b)
            }
        }
        context.stroke()
        context.restore()
    }

    static drawLArcJoin(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc3)
        context.rotate(deg * sc3)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.rotate(j * deg * Math.PI / 180)
            DrawingUtil.drawLine(context, 0, 0, 0, -size * sc1)
            context.restore()
        }
        DrawingUtil.drawArc(context, 0, 0, size, sc2)
        context.restore()
    } 

    static drawLAJNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawLArcJoin(context, scale)
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