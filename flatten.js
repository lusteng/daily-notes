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

// 巧妙应用apply
// Array.prototype.concat每次调用apply，将一维数组当参数执行concat连接
// 使用some检测存在是否存在嵌套数组（concat每次只能连接一维数组）
// Array.prototype.concat.apply 奇淫技巧 https://www.cnblogs.com/ziyunfei/archive/2012/09/18/2690412.html
function flatten(arr){ 
    while(arr.some(item => Array.isArray(item))){ 
        arr = Array.prototype.concat.apply([], arr)
    }
    return arr
}

let res = flatten(arr)

console.log(res);
