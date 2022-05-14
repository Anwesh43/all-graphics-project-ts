const colors : Array<string> = [
    "#1A237E",
    "#EF5350",
    "#AA00FF",
    "#C51162",
    "#00C853"
]
const backColor : string = "#BDBDBD"
const rot : number = Math.PI / 2
const delay : number = 20 
const strokeFactor : number = 90 
const sizeFactor : number = 11.2
const w : number = window.innerWidth 
const h : number = window.innerHeight
const parts : number = 4
const scGap : number = 0.04 / parts 

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}