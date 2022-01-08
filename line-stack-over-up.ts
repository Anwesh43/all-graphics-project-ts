const colors : Array<string> = [
    "#F44336",
    "#2196F3",
    "#FF9800",
    "#795548",
    "#8BC34A"
]
const backColor : string  = "#BDBDBD"
const delay : number = 20
const lines : number = 3  
const parts : number = lines + 2
const scGap : number = 0.02 / parts 
const sizeFactor : number = 6.3  
const divideFactor : number = 4 
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