// 扁平化数组，处理数据时常用
// const arr = [1, [[2], 3, 4], [22,12,[22]],5];
const arr = [1, [[2, [3232, [444]]], 3, 4], [{"aaa": "fff"},12,['ggg']],5];

function flatten(arr){
    let res = []
    arr.forEach(item => {
        if(Array.isArray(item)){
            res = res.concat(flatten(item)) 
        }else{
            res.push(item)
        }
    })
    return res
} 

// 仅针对数组项为number类型
function flatten(arr){
    return arr.toString().split(',').map(item => {
        return Number(item)
    })
}
 
/**
 * 巧妙应用apply
 * Array.prototype.concat每次调用apply，将一维数组当参数执行concat连接
 * 使用some检测存在是否存在嵌套数组（concat每次只能连接一维数组）
 */
function flatten(arr){ 
    while(arr.some(item => Array.isArray(item))){ 
        arr = Array.prototype.concat.apply([], arr)
    }
    return arr
}
 
/**
 * 使用Array reduce 方法， reduce 传入两个参数
 * @param1 fn 自定义的函数，函数提供四个参数 
        accumulator 上次循环返回的值，初始为数组第一项或者reduce 的参数2；
        currentValue 数组正在处理的元素
        currentIndex 数组中正在处理的当前元素的索引
        array 调用reduce()的数组
 * @param2 initialValue 为第一个函数参数 accumulator的初始值，不提供则以数组第一项为初始值 
 */
function flatten(arr){
    return arr.reduce((prev, cur) => prev.concat(Array.isArray(cur) ? flatten(cur) : cur), [])
} 

let res = flatten(arr)

console.log(res);