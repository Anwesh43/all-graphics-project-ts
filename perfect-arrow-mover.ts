const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const arrowTailFactor : number = 8.9 
const arrowHeadFactor : number = 7.2 
const parts : number = 4 
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 6.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 4 
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

    static drawArrowTail(context : CanvasRenderingContext2D, size : number, sc1 : number, sc2 : number) {
        const tailSize : number = size / arrowTailFactor 
        for (let j = 0; j < 2; j++) {
            context.save()
            context.translate(0, -tailSize)
            context.rotate(rot * sc2 * (1 - 2 * j))
            DrawingUtil.drawLine(context, 0, 0, 0, tailSize * Math.floor(sc1))
            context.restore()
        }
    }
    
    static drawArrowHead(context : CanvasRenderingContext2D, size : number, sc1 : number, sc3 : number) {
        const headSize : number = size / arrowHeadFactor 
        for (let j = 0; j < 2; j++) {
            context.save()
            context.translate(0, -size + headSize)
            context.rotate(rot * (1 - 2 * j) * sc3)
            DrawingUtil.drawLine(context, 0, 0, 0, -headSize * Math.floor(sc1))
            context.restore()
        }
    }

    static drawArrowLine(context : CanvasRenderingContext2D, size : number, sc1 : number, sc2 : number) {
        const tailSize : number = size / arrowTailFactor
        context.save()
        context.translate(0, -tailSize * Math.floor(sc1))
        DrawingUtil.drawLine(context, 0, 0, 0, -size * sc1 + Math.floor(sc1) * tailSize)
        context.restore()
    }

    static drawPAMNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        context.save()
        context.translate(w / 2, h / 2 - (h / 2) * sc4)
        DrawingUtil.drawArrowLine(context, size, sc1, sc2)
        DrawingUtil.drawArrowTail(context, size, sc1, sc2)
        DrawingUtil.drawArrowHead(context, size, sc1, sc3)
        context.restore()
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

 class PAMNode {

    prev : PAMNode 
    next : PAMNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new PAMNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context  : CanvasRenderingContext2D) {
        DrawingUtil.drawPAMNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : PAMNode {
        var curr : PAMNode = this.prev 
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

 class PerfectArrowMover {

    curr : PAMNode = new PAMNode(0)
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

    pam : PerfectArrowMover = new PerfectArrowMover()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.pam.draw(context)
    }

    handleTap(cb : Function) {
        this.pam.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.pam.update(() => {
                    this.animator.stop()
                })
            })
        })
    }
 }