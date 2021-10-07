const w : number = window.innerWidth
const h : number = window.innerHeight
const parts : number = 4 
const strokeFactor : number = 90 
const scGap : number = 0.04 / parts 
const sizeFactor : number = 11.9 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const deg : number = Math.PI / 2
const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number  {
        return Math.max(0, scale - i / n)
    }
    
    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}
