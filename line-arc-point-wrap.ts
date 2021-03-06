const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const deg : number = -90 
const sweep : number = 270 
const rot : number = Math.PI / 2 
const delay : number = 20 
const strokeFactor : number = 90 
const sizeFactor : number = 5.9 
const backColor : string = "#BDBDBD"
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const pointDeg : number = Math.PI / 4
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

    static drawSweepArc(context : CanvasRenderingContext2D, x : number, y : number, r : number, sc : number) {
        context.beginPath()
        for (let j = deg; j <= deg + sweep * sc; j++) {
            const x1 : number = x + r * Math.cos(j * Math.PI / 180)
            const y1 : number = y + r * Math.sin(j * Math.PI / 180)
            if (j == deg) {
                context.moveTo(x1, y1)
            } else {
                context.lineTo(x1, y1)
            }
        }
        context.stroke()
    }

    static drawLineArcPointWrap(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const sc3 : number = ScaleUtil.divideScale(scale, 2, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc4)
        context.rotate(pointDeg * sc3)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.rotate(rot * j)
            if (sc1 > 0) {
                DrawingUtil.drawLine(context, 0, 0, -size * sc1, 0)
            }
            context.restore()
        }
        DrawingUtil.drawSweepArc(context, 0, 0, size, sc2)       
        context.restore()
    }

    static drawLAPWNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawLineArcPointWrap(context, scale)
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
        this.context.fillStyle =  backColor 
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

class LAPWNode {

    next : LAPWNode 
    prev : LAPWNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new LAPWNode(this.i + 1)
            this.next.prev = this            
        }
    }
    
    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawLAPWNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : LAPWNode  {
        var curr : LAPWNode = this.prev 
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

class LineArcPointWrap {

    curr : LAPWNode = new LAPWNode(0)
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

    lapw : LineArcPointWrap = new LineArcPointWrap()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.lapw.draw(context)
    }

    handleTap(cb : Function) {
        this.lapw.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.lapw.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}