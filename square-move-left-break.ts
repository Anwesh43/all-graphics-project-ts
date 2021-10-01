const w : number = window.innerWidth
const h : number = window.innerHeight 
const parts : number = 3
const scGap : number = 0.03 / parts 
const sizeFactor : number = 12.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const colors : Array<string> = [
    "#F44336",
    "#03A9F4",
    "#FF9800",
    "#8BC34A",
    "#795548"
]

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return  Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawSquareMoveLeftBreak(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(-size / 2 + (w / 2 + size / 2) * sc1, size / 2 + (h / 2 - size / 2) * sc2)
        for (var j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            context.translate((w / 2 + size) * sc3, 0)
            context.fillRect(-size / 2, -size / 2, size, size)
            context.restore()
        }
        context.restore()
    }

    static drawSMLBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawSquareMoveLeftBreak(context, scale)
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
        this.scale += this.dir * scGap 
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

class SMLBNode {

    next : SMLBNode 
    prev : SMLBNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new SMLBNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawSMLBNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : SMLBNode {
        var curr : SMLBNode = this.prev 
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

class SquareMoveLeftBreak {

    curr : SMLBNode = new SMLBNode(0)
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

    smlb : SquareMoveLeftBreak = new SquareMoveLeftBreak()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.smlb.draw(context)
    }

    handleTap(cb : Function) {
        this.smlb.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.smlb.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}