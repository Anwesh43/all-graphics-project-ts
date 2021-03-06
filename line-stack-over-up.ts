const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const backColor : string  = "#BDBDBD"
const delay : number = 20
const divideFactor : number = 4 
const lines : number = divideFactor + 1 
const parts : number = lines + 2
const scGap : number = 0.04 / parts 
const sizeFactor : number = 6.3
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const strokeFactor : number = 90 
const deg : number = Math.PI  

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

    static drawLineStackOverUp(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const sc1 : number = ScaleUtil.divideScale(scale, lines, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, lines + 1, parts)
        console.log("SC1, SC2", `${sc1}, ${sc2}`)
        const uSize : number = size / divideFactor 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2) * sc2)
        context.rotate(deg * sc1)
        for (let k = 0; k < 2; k++) {
            let x = size
            let y = 0 
            context.save()
            context.scale(1 - 2 * k, 1)
            for (let j = 0; j < lines; j++) {
                const scj : number = ScaleUtil.divideScale(scale, j, parts)
                context.save()
                context.translate(x, y)
                if (scj > 0) {
                    DrawingUtil.drawLine(
                        context,
                        0,
                        0,
                        0,
                        -uSize * scj
                    )
                }
                context.restore()
                x -= uSize 
                y -= uSize 
            }
            context.restore()
        }
        context.restore()
    }

    static drawLSOUNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawLineStackOverUp(context, scale)
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
        console.log("SCALE", this.scale)
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

class LSOUNode {

    prev : LSOUNode
    next : LSOUNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new LSOUNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawLSOUNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : LSOUNode {
        var curr : LSOUNode = this.next 
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

class LineStackOverUp {

    curr : LSOUNode = new LSOUNode(0)
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

    lsou : LineStackOverUp = new LineStackOverUp()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.lsou.draw(context)
    }

    handleTap(cb : Function) {
        this.lsou.startUpdating(() => {
            this.animator.start(() =>  {
                console.log("STARTED")
                cb()
                this.lsou.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}