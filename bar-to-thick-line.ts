const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const backColor : string = "#BDBDBD"
const parts : number = 4 
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const delay : number = 20 
const sizeFactor : number = 11.3 
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const deg : number = Math.PI / 4
const barSizeFactor : number = 4

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawBarToThickLine(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)

        context.save()
        context.translate(w / 2, h / 2)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.rotate(deg * sc3 * (1 - 2 * j))
            for (let k = 0; k < 2; k++) {
                context.save()
                context.scale(1 - 2 * k, 1 - 2 * k)
                context.translate(0, (h / 2 + size / 2) * (1 - sc1))
                context.fillRect(0, -size / 2 + (size / barSizeFactor) * sc2, size, size - size * (2 / barSizeFactor) * sc2)
                context.restore()
            }
            context.restore()
        }
        context.restore()
    }

    static drawBTTLNode(context : CanvasRenderingContext2D, i : number, scale : number) {        
        context.fillStyle = colors[i]
        DrawingUtil.drawBarToThickLine(context, scale)
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

class State {

    scale : number = 0 
    dir : number = 0 
    prevScale : number = 0 

    update(cb : Function) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0
            this.prevScale = this.scale 
            cb()
        }
    }

    startUpdating(cb : Function) {
        if (this.dir == 0) {
            this.dir = 1 - 2 * this.prevScale 
            cb()
        }
    }
}

class Animator {

    animated : boolean = false 
    interval : number 

    start(cb : Function) {
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