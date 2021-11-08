const colors : Array<string> = [
    "#B71C1C",
    "#33691E",
    "#0091EA",
    "#00BFA5",
    "#FF6D00"
]
const backColor : string = "#BDBDBD"
const delay : number = 20 
const w : number = window.innerWidth 
const h : number = window.innerHeight
const strokeFactor : number = 90
const sizeFactor : number = 11.2  
const parts : number = 3
const scGap : number = 0.03 / parts 

class ScaleUtil {

    static maxScale(scale : number, i : number, n : number) : number {
        return Math.max(0, scale - i / n)
    }

    static divideScale(scale : number, i : number, n : number) : number {
        return Math.min(1 / n, ScaleUtil.maxScale(scale, i, n)) * n 
    }
}