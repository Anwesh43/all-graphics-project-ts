const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const parts : number = 4
const scGap : number = 0.03 / parts 
const rFactor : number = 11.9 
const w : number = window.innerWidth
const h : number = window.innerHeight 
const strokeFactor : number = 90 
const delay : number = 20 
const backColor : string = "#BDBDBD"


class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}
