const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 6
const scGap : number = 0.05 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 11.9 
const backColor : string = "#BDBDBD"
const triSizeFactor : number = 12.9 
const delay : number = 20 
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

    static drawCircle(context : CanvasRenderingContext2D, x : number, y : number, r : number) {
        context.beginPath()
        context.arc(x, y, r, 0, 2 * Math.PI)
        context.fill()
    }
    
    static drawTriArrow(context : CanvasRenderingContext2D, x : number, y : number, size : number, sc1 : number, sc2 : number) {
        context.save()
        context.translate(x, y)
        context.rotate(sc2 * Math.PI )
        context.beginPath()
        context.moveTo(0, -size / 2)
        context.lineTo(size, 0)
        context.lineTo(0, size / 2)
        context.lineTo(0, -size / 2)
        context.clip()
        context.fillRect(0,  -size / 2, size * sc1, size)
        context.restore()
    }

    

    static drawCircleArrowLauncher(context : CanvasRenderingContext2D, scale : number) {
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        const r : number = Math.min(w, h) / sizeFactor 
        const size : number = Math.min(w, h) / triSizeFactor
        context.save()
        context.translate(w / 2, h / 2)
        context.rotate(Math.PI * dsc(3))
        DrawingUtil.drawCircle(context, 0, (h / 2 + r) * dsc(5), r * dsc(0))
        for (let j = 0 ; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawTriArrow(context, -w / 2 + (w / 2 - r) * dsc(2) - (w / 2 + size) * dsc(4), 0, size, dsc(1), dsc(2))
            context.restore()
        }
        context.restore()
    }

    static drawCALNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawCircleArrowLauncher(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D | null 
    renderer : Renderer = new Renderer()

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        document.body.appendChild(this.canvas)
        this.context = this.canvas.getContext('2d')
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

class CALNode {

    prev : CALNode 
    next : CALNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new CALNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawCALNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : CALNode {
        var curr : CALNode = this.prev 
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

class CircleArrowLauncher {

    curr : CALNode = new CALNode(0)
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

    cal : CircleArrowLauncher = new CircleArrowLauncher()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.cal.draw(context)
    }

    handleTap(cb : () => void) {
        this.cal.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.cal.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}