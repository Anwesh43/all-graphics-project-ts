const w : number = window.innerWidth 
const h : number = window.innerHeight 
const parts : number = 3 
const scGap : number = 0.03 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 12.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const boxSizeFactor : number = 20.9 
const colors : Array<string> = [
    "#B71C1C",
    "#00C853",
    "#0091EA",
    "#AA00FF",
    "#FFAB00"
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

    static drawAtXY(context : CanvasRenderingContext2D, x : number, y : number, cb : Function) {
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

    static drawBoxLineTraveller(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const boxSize : number = Math.min(w, h) / boxSizeFactor
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2 - h * sc3)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawAtXY(context, -size / 2, -h / 2 + h * sc1, () => {
                DrawingUtil.drawLine(context, 0, 0, 0, -size)
            })
            DrawingUtil.drawAtXY(context, -size / 2, -h / 2 + (h - size) * sc2, () => {
                context.fillRect(-boxSize / 2, -boxSize, boxSize, boxSize)
            })
            context.restore()
        }
        context.restore()
    }

    static drawBLTNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawBoxLineTraveller(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D
    renderer : Renderer = new Renderer() 

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
        this.renderer.render(this.context)
    }

    handleTap() {
        this.canvas.onmousedown = () => {
            this.renderer.handleTap(() => {
                this.render()
            })
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

class BLTNode {

    prev : BLTNode 
    next : BLTNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new BLTNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawBLTNode(context, this.i, this.state.scale)
    } 

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : BLTNode {
        var curr : BLTNode = this.prev 
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

class BoxLineTraveller {

    curr : BLTNode = new BLTNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : Function) {
        this.curr.update(() => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb()
        })
    }

    startUpdating(cb : Function) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {

    blt : BoxLineTraveller = new BoxLineTraveller()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.blt.draw(context)
    }

    handleTap(cb : Function) {
        this.blt.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.blt.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}