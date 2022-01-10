const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const backColor : string = "#BDBDBD"
const sizeFactor : number  = 5.9 
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const strokeFactor : number = 90 
const delay : number = 20
const parts : number = 2 
const scGap : number = 0.02 / parts 

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

    static drawTreeNodeBench(context : CanvasRenderingContext2D, scale : number, x : number, y : number, size : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc2 : number = ScaleUtil.divideScale(scale, 1, parts)
        context.save()
        context.translate(x, y)
        DrawingUtil.drawLine(context, -size * 0.5 * sc1, 0, size * 0.5 * sc1, 0)
        for (let j = 0; j < 2; j++) {
            context.save()
            context.scale(1 - 2 * j, 1)
            DrawingUtil.drawLine(context, -size / 2, 0, -size / 2, size * 0.25 * sc2)
            context.restore()
        }
        context.restore()
    }

    static drawTNB(context : CanvasRenderingContext2D, i : number, scale : number, x : number, y : number, size : number) {
        context.lineCap = 'round'
        context.lineWidth = Math.min(w, h) / strokeFactor 
        context.strokeStyle = colors[i]
        DrawingUtil.drawTreeNodeBench(context, scale, x, y, size)
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

class TNBNode {

    right : TNBNode 
    left : TNBNode 
    state : State = new State()

    constructor(
        private i : number = 0,
        private x : number = w / 2,
        private y : number = h / 2,
        private size : number = Math.min(w, h) / sizeFactor
    ) {
        if (this.i < colors.length - 1) {
            this.right = new TNBNode(this.i + 1, x + size / 2, y + size / 4, size / 2)
            this.left = new TNBNode(this.i + 1, x - size / 2, y + size / 4, size / 2)
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawTNB(context, this.i, this.state.scale, this.x, this.y, this.size)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getChildren() : Array<TNBNode> {
        return [this.left, this.right]
    }
}

class TreeNodeBench {

    drawingQueue : Array<TNBNode> = [new TNBNode()]
    updatingQueue : Array<TNBNode> = [new TNBNode()]

    draw(context : CanvasRenderingContext2D) {
        this.drawingQueue.forEach((tnb : TNBNode) => {
            tnb.draw(context)
        })
    }

    update(cb : Function) {
        const l = this.updatingQueue.length
        for (let i = 0; i < l; i++) {
            const tnb : TNBNode = this.updatingQueue[i]
            tnb.update(() => {
                if (i == l - 1) {
                        
                    this.updatingQueue.forEach((tnb : TNBNode) => {
                        this.drawingQueue.push(tnb.left)
                        this.drawingQueue.push(tnb.right)
                        this.updatingQueue.push(tnb.left)
                        this.updatingQueue.push(tnb.right)
                    })
                    this.updatingQueue.splice(0, l)
                    cb()
                }
            })
        }
    
    }

    startUpdating(cb : Function) {
        
        this.updatingQueue.forEach((tnb : TNBNode, i : number) => {
            tnb.startUpdating(() => {
                
                if (i == 0) {
                    cb()
                }
            })
        })
    }
}

class Renderer {

    tnb : TreeNodeBench = new TreeNodeBench()
    animator : Animator = new Animator()

    render(context : CanvasRenderingContext2D) {
        this.tnb.draw(context)
    }

    handleTap(cb : Function) {
        this.tnb.startUpdating(() => {
            this.animator.start(() => {
                cb()
                this.tnb.update(() => {
                    this.animator.stop()
                    cb()
                })
            })
        })
    }
}