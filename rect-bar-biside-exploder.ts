const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
]
const parts : number = 4
const scGap : number = 0.04 / parts 
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

    static drawBar(context  : CanvasRenderingContext2D, size : number, sc1 : number, rot : number) {
        context.save()
        context.translate(0, 0)
        context.rotate(rot)
        context.fillRect(-size * 0.5 * sc1, -size, size * sc1, size)
        
        context.fillRect(-size * 0.5 * sc1, -2 * size, size * sc1, size)
        context.restore()
    }

    static drawRectBarBiSideExploder(context : CanvasRenderingContext2D, scale : number) {
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number)  : number => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate(w / 2, h - size / 2)
        for (let j = 0; j < 3; j++) {
            const k : number = j % 2 
            const n : number = Math.floor(j / 2)
            const ki : number = (1 - k)
            context.save()
            context.translate((w / 2 + 2 * size) * (1 - 2 * n) * ki * dsc(2), -(h + 2 * size) * k * dsc(3))
            DrawingUtil.drawBar(context, size, dsc(0), (j - 1) * dsc(1) * rot)
            context.restore()
        }
        context.restore()
    }

    static drawRBBSENode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i] 
        DrawingUtil.drawRectBarBiSideExploder(context, scale)
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

class RBBSENode {

    prev : RBBSENode 
    next : RBBSENode 
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new RBBSENode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawRBBSENode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : RBBSENode {
        var curr : RBBSENode = this.prev 
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

class RectBarBiSideExploder {

    curr : RBBSENode = new RBBSENode(0)
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

    rbbse : RectBarBiSideExploder = new RectBarBiSideExploder()
    animator : Animator = new Animator()
    
    render(context : CanvasRenderingContext2D) {
        this.rbbse.draw(context)
    }

    handleTap(cb : () => void) {
        this.rbbse.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.rbbse.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    } 
}