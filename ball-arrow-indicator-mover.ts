const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const backColor : string = "#BDBDBD"
const parts : number = 4 
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 12.2 
const arrowSizeFactor : number = 29.2 
const delay : number = 20 
const deg : number = Math.PI / 4 
const rot : number = Math.PI / 2
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

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }

    static drawBallArrowIndicatorMover(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h)  / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const arrowSize : number = Math.min(w, h) / arrowSizeFactor
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc4)
        context.rotate(rot * sc3)
        DrawingUtil.drawCircle(context, 0, 0, size * sc1)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.rotate(deg * (1 - 2 * j))
            DrawingUtil.drawLine(context, 0, 0, -arrowSize * sc2, 0)
            context.restore()
        }
        context.restore()
    }

    static drawBAIMNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.strokeStyle = backColor 
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.fillStyle = colors[i]
        DrawingUtil.drawBallArrowIndicatorMover(context, scale)
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

class BAIMNode {

    prev : BAIMNode 
    next : BAIMNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new BAIMNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawBAIMNode(context, this.i, this.state.scale)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    getNext(dir : number, cb : Function) : BAIMNode {
        var curr : BAIMNode = this.prev 
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

class BallArrowIndicatorMover {

    curr : BAIMNode = new BAIMNode(0)
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

    baim : BallArrowIndicatorMover = new BallArrowIndicatorMover()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.baim.draw(context)
    }

    handleTap(cb : Function) {
        this.baim.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.baim.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}