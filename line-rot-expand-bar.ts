const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 8.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
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

    static drawLineRotExpandBar(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) : number => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate(w / 2 - (w / 2) * dsc(3), h / 2)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1, 1 - 2 * j)
            context.rotate(rot * (1 - j) * dsc(1))
            DrawingUtil.drawLine(context, 0, 0, 0, size * dsc(0))
            context.restore()
        }
        context.fillRect(-size * dsc(2), -size / 2, size * dsc(2), size / 2)
        context.restore()
    }

    static drawLREBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.lineCap = 'round'
        context.strokeStyle = colors[i]
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.fillStyle = colors[i]
        DrawingUtil.drawLineRotExpandBar(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D | null 
    renderer : Renderer = new Renderer()

    initCanvas() {
        this.canvas.width =  w 
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

class LREBNode {

    prev : LREBNode
    next : LREBNode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new LREBNode(this.i + 1)
            this.next.prev = this 
        }
    }
    
    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawLREBNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : LREBNode {
        var curr : LREBNode = this.prev 
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

class LineRotExpand {

    curr : LREBNode = new LREBNode(0)
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

class Renderer {

    animator : Animator = new Animator()
    lreb : LineRotExpand = new LineRotExpand()

    render(context : CanvasRenderingContext2D) {
        this.lreb.draw(context)
    }

    handleTap(cb : () => void) {
        this.lreb.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.lreb.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}