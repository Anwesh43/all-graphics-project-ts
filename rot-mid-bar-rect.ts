const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 5
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 4.9 
const barWFactor : number = 11.2 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI 
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

    static drawRotMidBarRect(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const barW : number = Math.min(w, h) / barWFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * dsc(4))
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawLine(context, -barW / 2, 0, -barW / 2 - (size / 2 - barW / 2) * dsc(j * 3), 0)
            context.restore()
        }
        context.save()
        context.rotate(rot * dsc(2))
        context.fillRect(-barW / 2, -size * dsc(1), barW, size * dsc(1))
        context.restore()
        context.restore()
    }

    static drawRMBRNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawRotMidBarRect(context, scale)
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

class RMBRNode {

    prev : RMBRNode 
    next : RMBRNode 
    state : State = new State()

    constructor(private i : number) {

    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new RMBRNode(this.i + 1)
            this.next.prev = this 
        }
    }
    
    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawRMBRNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : RMBRNode {
        var curr : RMBRNode = this.prev 
        if (dir == 1) {
            curr = this.next 
        }
        if (curr) {
            return curr 
        }
        cb()
        return this 
    }
}

class RotMidBarRect {

    curr : RMBRNode = new RMBRNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : () => void) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : () => void) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {

    rmbr : RotMidBarRect = new RotMidBarRect()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.rmbr.draw(context)
    }

    handleTap(cb : () => void) {
        this.rmbr.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.rmbr.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}