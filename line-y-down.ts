const w : number = window.innerWidth
const h : number = window.innerHeight 
const parts : number = 4 
const scGap : number = 0.04 / parts 
const strokeFactor : number = 90 
const sizeFactor : number = 12.9
const delay : number = 20 
const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const backColor : string = "#bdbdbd"
const rot : number = Math.PI 
const deg : number = Math.PI / 4

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}
