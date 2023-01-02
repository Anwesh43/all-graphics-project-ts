const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 5
const scGap : number = 0.04 / parts 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const rot : number = -Math.PI / 4
const sizeFactor : number = 4.9 
const strokeFactor : number = 90 
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const deg : number = 270
const start : number = 180 
const rad : number = Math.PI / 180 

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

    static drawXY(context : CanvasRenderingContext2D, x : number, y : number, cb : () => void) {
        context.save()
        context.translate(x, y)
        cb()
        context.restore()
    }

    static drawArc(context : CanvasRenderingContext2D, x : number, y : number, r : number, start : number, deg : number) {
        context.save()
        context.translate(x, y)
        context.beginPath()
        context.moveTo(0, 0)
        for (let j = start; j <= start + deg; j++) {
            const a : number = r * Math.cos(j * rad)
            const b : number = r * Math.sin(j * rad)
            context.lineTo(a, b)
        }
        context.fill()
        context.restore()
    }

    static drawLineRotArcDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        DrawingUtil.drawXY(context, w / 2, h / 2 - (h / 2 + size) * dsc(5), () => {
            context.rotate(rot * dsc(4))
            for (let j = 0; j < 2; j++) {
                DrawingUtil.drawXY(context, 0, 0, () => {
                    context.rotate(deg * rad * dsc(1) * j)
                    DrawingUtil.drawLine(context, 0, 0, 0, -size * dsc(0))
                })
            }
            DrawingUtil.drawArc(context, 0, 0, size / 5, start, deg * dsc(2))
            context.fillRect(-size * dsc(3), 0, size * dsc(3), size)
        })
    }
    
    static drawLRADNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        DrawingUtil.drawLineRotArcDown(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D | null 
    renderer : Renderer = new Renderer()

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
            this.renderer.render(this.context)
        }
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

class LRADNode {

    next : LRADNode 
    prev : LRADNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new LRADNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawLRADNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : LRADNode {
        var curr : LRADNode = this.prev 
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

class LineRotArcDown {

    curr : LRADNode = new LRADNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : () => void) {
        this.curr.update(() => {
            this.curr.getNext(this.dir, () => {
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

    lrad : LineRotArcDown = new LineRotArcDown()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.lrad.draw(context)
    }

    handleTap(cb : () => void) {
        this.lrad.startUpdating(() => {
            this.animator.start(() => {
                this.lrad.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}