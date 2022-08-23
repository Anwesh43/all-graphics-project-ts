const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const parts : number = 3
const scGap : number = 0.03 / parts 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const sizeFactor : number = 5.9 
const wFactor : number = 11.2 
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

    static drawSideBarGraphMove(context : CanvasRenderingContext2D, scale : number) {
        const barW : number = Math.min(w, h) / wFactor 
        const size : number = Math.min(w, h) / sizeFactor 
        const dsc : (number) => number = (i : number) => ScaleUtil.divideScale(scale, i, parts)
        context.save()
        context.translate(w / 2, -(h / 2) * (1 - dsc(0)) + h / 2 + (h / 2 + size) * dsc(2))
        for (let j = 0; j < 2; j++) {
            const barH : number = (size) * (1 - dsc(1)) * (1 - j) + size * j * dsc(1)
            context.save()
            context.translate(w / 2 + barW * (j - 1), 0)
            context.fillRect(0, -barH, barW, barH)
            context.restore()
        }
        context.restore()
    }
    
    static drawSBGMNode(context : CanvasRenderingContext2D, i : number, scale : number) {
        context.fillStyle = colors[i]
        DrawingUtil.drawSideBarGraphMove(context, scale)
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

class SBGMNode {

    prev : SBGMNode 
    next : SBGMNode 
    state : State = new State()

    addNeighbor() {
        if (this.i < colors.length - 1) {
            this.next = new SBGMNode(this.i + 1)
            this.next.prev = this 
        }
    }

    constructor(private i : number) {
        this.addNeighbor()
    }

    draw(context : CanvasRenderingContext2D) {
        DrawingUtil.drawSBGMNode(context, this.i, this.state.scale)
    }

    update(cb : () => void) {
        this.state.update(cb)
    }

    startUpdating(cb : () => void) {
        this.state.startUpdating(cb)
    }

    getNext(dir : number, cb : () => void) : SBGMNode {
        var curr : SBGMNode = this.prev 
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

class SideBarGraphMove {

    curr : SBGMNode = new SBGMNode(0)
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