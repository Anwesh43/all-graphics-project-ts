const colors : Array<string> = [
    "#B71C1C",
    "#33691E",
    "#0091EA",
    "#00BFA5",
    "#FF6D00"
]
const w : number = window.innerWidth
const h : number = window.innerHeight 
const parts : number = 4
const scGap : number = 0.03 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 5.9 
const delay : number = 20 
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

    static drawLine(context : CanvasRenderingContext2D, x1 : number, y1 : number, x2 : number, y2 : number) {
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawSqAltOver(context : CanvasRenderingContext2D, scale : number) {
        const constantSize : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const size : number = constantSize * (1 - sc4)
        context.save()
        context.translate(w / 2, h / 2)
        for (var j = 0; j < 2; j++) {
            const upSize : number = size * 0.25 * (1 - sc3)
            context.save()
            context.scale(1 - 2 * j, 1 - 2 * j)
            context.translate(upSize, upSize)
            DrawingUtil.drawLine(context, size / 4, -size / 4, size / 4, -size / 4 + size * 0.5 * sc1)
            DrawingUtil.drawLine(context, size / 4, size / 4, size / 4 - size * 0.5 * sc2, size / 4)
            context.restore()
        }
        context.restore()
    }

    static drawSAONode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawSqAltOver(context, scale)
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

class SAONode {

    prev : SAONode 
    next : SAONode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new SAONode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawSAONode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : SAONode {
        var curr : SAONode = this.prev 
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

class SqAltOver {

    curr : SAONode = new SAONode(0)
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

    sao : SqAltOver = new SqAltOver()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.sao.draw(context)
    }
    
    handleTap(cb : Function) {
        this.sao.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.sao.update(() => {
                    cb()
                    this.animator.stop()
                })
            })
        })
    }
}