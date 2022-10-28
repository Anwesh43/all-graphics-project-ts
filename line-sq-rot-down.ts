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
const sqSizeFactor : number = 6.9 
const delay : number = 20 
const rot : number = Math.PI / 2
const backColor : string = "#BDBDBD"
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
        if (Math.abs(x1 - x2) < 0.1 && Math.abs(y1 - y2) < 0.1) {
            return 
        }
        context.beginPath()
        context.moveTo(x1, y1)
        context.lineTo(x2, y2)
        context.stroke()
    }

    static drawLineSqRotDown(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sqSizeFactor
        const dsc : (number) => number =  (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate((w / 2) * dsc(1), h / 2 + (h / 2) * dsc(4))
        DrawingUtil.drawLine(context, -size + size * dsc(3), 0, 0, 0)
        context.save()
        context.rotate(rot * dsc(2))
        context.fillRect(0, -size, size * dsc(0), size)
        context.restore()
        context.restore() 
    }

    static drawLSRDNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.strokeStyle = colors[i]
        context.fillStyle = colors[i]
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        DrawingUtil.drawLineSqRotDown(context, scale)
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

class LSRDNode {

    prev : LSRDNode 
    next : LSRDNode 
    state : State = new State()

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new LSRDNode(this.i + 1)
            this.next.prev = this 
        }
    }

    constructor(private i : number) {
        this.addNeighbor()
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawLSRDNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }
    
    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : LSRDNode {
        var curr : LSRDNode = this.prev 
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

class LineSqRotDown {

    curr : LSRDNode = new LSRDNode(0)
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

    lsrd : LineSqRotDown = new LineSqRotDown()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.lsrd.draw(context)
    }

    handleTap(cb : () => void) {
        this.lsrd.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.lsrd.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}