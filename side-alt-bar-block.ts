const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 5 
const scGap : number = 0.04 / parts 
const delay : number = 20 
const strokeFactor : number = 90 
const sizeFactor : number = 5.9  
const blockSizeFactor : number = 3.9 
const w : number = window.innerWidth 
const h : number = window.innerHeight 
const rot : number = Math.PI / 2 
const backColor : string = "#BDBDBD"

class ScaleUtil {

    static maxScale(scale :  number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}

class DrawingUtil {

    static drawSideAltBarBlock(context : CanvasRenderingContext2D, scale : number) {
        const sc1 : number = ScaleUtil.divideScale(scale, 0, parts)
        const sc4 : number = ScaleUtil.divideScale(scale, 3, parts)
        const sc5 : number = ScaleUtil.divideScale(scale, 4, parts)
        const size : number = Math.min(w, h) / sizeFactor 
        const barSize : number = size / blockSizeFactor 
        context.save()
        context.translate(w / 2, h / 2 + (h / 2 + size) * sc5)
        context.rotate(rot * sc4)
        context.fillRect(-size * 0.5 * sc1, 0, size * sc1, size / 2)
        for (let j = 0;  j < 2; j++) {
            context.save()
            context.translate(-size / 2 + (size - barSize) * j, -(size / 2 - barSize) * ScaleUtil.divideScale(scale, j + 1, parts))
            context.fillRect(0, 0, barSize * Math.floor(sc1), barSize * Math.floor(sc1))
            context.restore()
        }
        context.restore()
    }

    static drawSABBNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawSideAltBarBlock(context, scale)
    }
}

class Stage {

    canvas : HTMLCanvasElement = document.createElement('canvas')
    context : CanvasRenderingContext2D

    initCanvas() {
        this.canvas.width = w 
        this.canvas.height = h 
        this.context = this.canvas.getContext('2d')
        document.body.appendChild(this.canvas)
    }

    render() {
        this.context.fillStyle = backColor 
        this.context.fillRect(0, 0, w, h)
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

class SABBNode {

    prev : SABBNode 
    next : SABBNode    
    state : State = new State()

    constructor(private i : number) {
        this.addNeighbor()
    }

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new SABBNode(this.i + 1)
            this.next.prev = this 
        }
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawSABBNode(context, this.i, this.state.scale)
    }

    update(cb : Function) {
        this.state.update(cb)
    }

    startUpdating(cb : Function) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : Function) : SABBNode {
        var curr : SABBNode = this.prev 
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

class SideAltBarBlock {

    curr : SABBNode = new SABBNode(0)
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