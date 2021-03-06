const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 2 
const bars : number = 5
const scGap : number = 0.03 / (parts * bars)
const sizeFactor : number = 5.9 
const barHFactor : number = 14.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const strokeFactor : number = 90 
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

    static drawBarAltShifter(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const barSize : number = Math.min(w, h) / barHFactor 
        context.save()
        context.translate(w / 2, h)
        for (let i = 0; i < bars; i++) {
            const sci1 : number = ScaleUtil.divideScale(sc1, i, bars)
            const sci2 : number = ScaleUtil.divideScale(sc2, bars - 1 - i, bars)
            context.save()
            context.translate((w / 2 + size) * (1 - 2 * (i % 2)) * sci2, -barSize * i)
            context.fillRect(0, -barSize * sci1, size, barSize * sci1)
            context.restore()
        }
        context.restore()
    }

    static drawBASNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawBarAltShifter(context, scale)
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

    render(){ 
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

    update(cb : (a : number) => void) {
        this.scale += scGap * this.dir 
        if (Math.abs(this.scale - this.prevScale) > 1) {
            this.scale = this.prevScale + this.dir 
            this.dir = 0 
            this.prevScale = this.scale 
            cb(this.prevScale)
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

class BASNode {

    prev : BASNode 
    next : BASNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new BASNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawBASNode(context, this.i, this.state.scale)
    }

    update(cb : (a : number) => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : BASNode {
        var curr : BASNode = this.prev 
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

class BarAltShifter {

    curr : BASNode = new BASNode(0)
    dir : number = 1

    draw(context : CanvasRenderingContext2D) {
        this.curr.draw(context)
    }

    update(cb : (a : number) => void) {
        this.curr.update((k : number) => {
            this.curr = this.curr.getNext(this.dir, () => {
                this.dir *= -1
            })
            cb(k)
        })
    }

    startUpdating(cb : () => void) {
        this.curr.startUpdating(cb)
    }
}

class Renderer {

    bas : BarAltShifter = new BarAltShifter()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.bas.draw(context)
    }

    handleTap(cb : () => void) {
        this.bas.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.bas.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}