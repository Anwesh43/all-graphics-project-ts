const colors : Array<string> = [
    "#4A148C",
    "#004D40",
    "#DD2C00",
    "#D50000",
    "#43A047"
] 
const parts : number = 4
const scGap : number = 0.04 / parts 
const delay : number = 20 
const backColor : string = "#BDBDBD"
const sizeFactor : number = 11.9 
const rFactor : number = 7.2 
const strokeFactor : number = 90 
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
